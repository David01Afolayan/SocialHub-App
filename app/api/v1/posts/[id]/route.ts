import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { extractHashtags } from "@/lib/content/hashtags"
import { extractMentions } from "@/lib/content/mentions"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/services/notification.service"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true, reposts: true } },
    },
  })
  if (!post || !post.published || post.visibility !== "PUBLIC" || post.moderationStatus !== "APPROVED") {
    return failure("Post not found.", 404, "NOT_FOUND")
  }
  const session = await auth()
  const [like, bookmark] = session?.user?.id
    ? await Promise.all([
        prisma.like.findUnique({ where: { userId_postId: { userId: session.user.id, postId: id } } }),
        prisma.bookmark.findUnique({ where: { userId_postId: { userId: session.user.id, postId: id } } }),
      ])
    : [null, null]
  return success({ ...post, liked: Boolean(like), bookmarked: Boolean(bookmark) })
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  if (post.authorId !== session.user.id) return failure("You can only edit your own post.", 403, "FORBIDDEN")

  const body = await request.json()
  const content = typeof body.content === "string" ? body.content.trim() : ""
  if (content.length > 5000) return failure("Post cannot exceed 5000 characters.", 400, "CONTENT_TOO_LONG")
  const updated = await prisma.post.update({ where: { id }, data: { content } })

  await prisma.postHashtag.deleteMany({ where: { postId: id } })
  for (const name of extractHashtags(content)) {
    const hashtag = await prisma.hashtag.upsert({ where: { name }, update: {}, create: { name } })
    await prisma.postHashtag.upsert({
      where: { postId_hashtagId: { postId: id, hashtagId: hashtag.id } },
      update: {},
      create: { postId: id, hashtagId: hashtag.id },
    })
  }

  await prisma.postMention.deleteMany({ where: { postId: id } })
  for (const username of extractMentions(content)) {
    const mentionedUser = await prisma.user.findUnique({ where: { username }, select: { id: true } })
    if (!mentionedUser) continue
    await prisma.postMention.upsert({
      where: { postId_userId: { postId: id, userId: mentionedUser.id } },
      update: {},
      create: { postId: id, userId: mentionedUser.id },
    })
    if (mentionedUser.id !== session.user.id) {
      await createNotification({
        userId: mentionedUser.id,
        actorId: session.user.id,
        postId: id,
        type: "MENTION",
        title: "You were mentioned",
        message: "You were mentioned in a post.",
      })
    }
  }
  return success(updated)
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  if (post.authorId !== session.user.id) return failure("You can only delete your own post.", 403, "FORBIDDEN")
  await prisma.post.delete({ where: { id } })
  return success({ deleted: true })
}
