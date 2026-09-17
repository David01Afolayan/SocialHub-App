import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"
import { queueModeration } from "@/lib/jobs/moderation.job"
import { extractHashtags } from "@/lib/content/hashtags"
import { extractMentions } from "@/lib/content/mentions"
import { createNotification } from "@/lib/services/notification.service"
import { z } from "zod"

const createPostSchema = z.object({
  content: z.string().trim().max(5000).optional(),
  mediaUrls: z.array(z.string().url()).max(10).default([]),
  visibility: z.enum(["PUBLIC", "FOLLOWERS", "PRIVATE"]).default("PUBLIC"),
  scheduledAt: z.string().datetime().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
    const data = createPostSchema.parse(await request.json())
    if (!data.content && data.mediaUrls.length === 0) throw new Error("POST_EMPTY")

    const post = await prisma.post.create({
      data: {
        content: data.content ?? null,
        mediaUrls: data.mediaUrls,
        mediaUrl: data.mediaUrls[0] ?? null,
        visibility: data.visibility,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        published: data.scheduledAt ? false : true,
        moderationStatus: "PENDING_REVIEW",
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, username: true, image: true } },
      },
    })

    const content = data.content ?? ""
    for (const name of extractHashtags(content)) {
      const hashtag = await prisma.hashtag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
      await prisma.postHashtag.upsert({
        where: { postId_hashtagId: { postId: post.id, hashtagId: hashtag.id } },
        update: {},
        create: { postId: post.id, hashtagId: hashtag.id },
      })
    }

    for (const username of extractMentions(content)) {
      const mentionedUser = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      })
      if (!mentionedUser) continue
      await prisma.postMention.upsert({
        where: { postId_userId: { postId: post.id, userId: mentionedUser.id } },
        update: {},
        create: { postId: post.id, userId: mentionedUser.id },
      })
      if (mentionedUser.id !== session.user.id) {
        await createNotification({
          userId: mentionedUser.id,
          actorId: session.user.id,
          postId: post.id,
          type: "MENTION",
          title: "You were mentioned",
          message: "You were mentioned in a post.",
        })
      }
    }

    await queueModeration({
      targetType: "POST",
      targetId: post.id,
      content: data.content ?? "",
    })

    return success(post, 201)
  } catch (error) {
    if (error instanceof z.ZodError) return failure("Validation failed.", 400, "VALIDATION_ERROR")
    if (error instanceof Error && error.message === "POST_EMPTY") return failure("Content or media required.", 400, "POST_EMPTY")
    console.error("CREATE_POST_ERROR", error)
    return failure("Unable to create post.", 500, "CREATE_POST_FAILED")
  }
}
