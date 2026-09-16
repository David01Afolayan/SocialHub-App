import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const original = await prisma.post.findUnique({
    where: { id },
    select: { id: true, published: true, visibility: true, moderationStatus: true },
  })
  if (!original) return failure("Post not found.", 404, "NOT_FOUND")
  if (!original.published || original.visibility !== "PUBLIC" || original.moderationStatus !== "APPROVED") {
    return failure("This post cannot be reposted.", 403, "POST_UNAVAILABLE")
  }
  const repost = await prisma.post.create({
    data: { authorId: session.user.id, parentPostId: original.id, content: null, published: true, moderationStatus: "APPROVED" },
  })
  return success({ repost }, 201)
}
