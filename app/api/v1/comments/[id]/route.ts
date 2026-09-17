import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { deleteComment, findCommentById } from "@/lib/repositories/comment.repository"

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const comment = await findCommentById(id)
  if (!comment) return failure("Comment not found.", 404, "NOT_FOUND")
  if (comment.userId !== session.user.id) return failure("You can only delete your own comment.", 403, "FORBIDDEN")
  await deleteComment(id)
  return success({ deleted: true })
}
