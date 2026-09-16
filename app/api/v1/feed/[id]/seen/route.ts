import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { markPostSeen } from "@/lib/recommendation/seen-posts"

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  await markPostSeen(session.user.id, id)
  return success({ seen: true })
}
