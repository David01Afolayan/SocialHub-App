import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/services/notification.service"
import { createCommentSchema } from "@/lib/validations/comment"
import { createComment, getComments } from "@/lib/repositories/comment.repository"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const post = await prisma.post.findUnique({
    where: { id },
    select: { published: true, visibility: true, moderationStatus: true },
  })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  if (!post.published || post.visibility !== "PUBLIC" || post.moderationStatus !== "APPROVED") {
    return failure("This post is unavailable.", 403, "POST_UNAVAILABLE")
  }
  return success({ items: await getComments(id) })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const parsed = createCommentSchema.safeParse(await request.json())
  if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Invalid comment.", 400, "INVALID_COMMENT")
  const post = await prisma.post.findUnique({ where: { id }, select: { id: true, authorId: true, published: true, visibility: true, moderationStatus: true } })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  if (!post.published || post.visibility !== "PUBLIC" || post.moderationStatus !== "APPROVED") return failure("This post is unavailable.", 403, "POST_UNAVAILABLE")
  if (parsed.data.parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parsed.data.parentId },
      select: { id: true, postId: true },
    })
    if (!parent) return failure("Parent comment not found.", 404, "PARENT_NOT_FOUND")
    if (parent.postId !== id) return failure("Comment does not belong to this post.", 400, "INVALID_PARENT")
  }
  const comment = await createComment({
    content: parsed.data.content,
    postId: id,
    userId: session.user.id,
    parentId: parsed.data.parentId,
  })
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
