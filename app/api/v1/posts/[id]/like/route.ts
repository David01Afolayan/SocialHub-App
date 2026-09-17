import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/services/notification.service"

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId: session.user.id, postId: id } } })
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return success({ liked: false })
  }
  await prisma.like.create({ data: { userId: session.user.id, postId: id } })
  if (post.authorId !== session.user.id) {
    await createNotification({
      userId: post.authorId,
      actorId: session.user.id,
      postId: id,
      type: "LIKE",
      title: "New like",
      message: "Someone liked your post.",
    })
  }
  return success({ liked: true })
}
