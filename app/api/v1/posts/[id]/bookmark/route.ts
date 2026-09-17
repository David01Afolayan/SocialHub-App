import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const post = await prisma.post.findUnique({ where: { id }, select: { id: true } })
  if (!post) return failure("Post not found.", 404, "NOT_FOUND")
  const existing = await prisma.bookmark.findUnique({ where: { userId_postId: { userId: session.user.id, postId: id } } })
  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
    return success({ bookmarked: false })
  }
  await prisma.bookmark.create({ data: { userId: session.user.id, postId: id } })
  return success({ bookmarked: true })
}
