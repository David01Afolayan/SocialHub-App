import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/services/notification.service"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const comments = await prisma.comment.findMany({
    where: { postId: id, moderationStatus: "APPROVED" },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, name: true, username: true, image: true } } },
  })
  return success({ comments })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const body = await request.json()
  const content = typeof body.content === "string" ? body.content.trim() : ""
  if (!content || content.length > 2000) return failure("Comment must be between 1 and 2000 characters.", 400, "INVALID_COMMENT")
  const post = await prisma.post.findUnique({ where: { id }, select: { id: true, authorId: true, published: true, visibility: true, moderationStatus: true } })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  if (!post.published || post.visibility !== "PUBLIC" || post.moderationStatus !== "APPROVED") return failure("This post is unavailable.", 403, "POST_UNAVAILABLE")
  const comment = await prisma.comment.create({ data: { content, postId: id, userId: session.user.id, moderationStatus: "APPROVED" } })
  if (post.authorId !== session.user.id) {
    await createNotification({
      userId: post.authorId,
      type: "COMMENT",
      title: "New comment",
      message: "Someone commented on your post.",
      postId: id,
      actorId: session.user.id,
    })
  }
  return success({ comment }, 201)
}
