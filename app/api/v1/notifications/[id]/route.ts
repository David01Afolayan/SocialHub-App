import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { invalidateUnreadCount } from "@/lib/cache/notification-cache"
import { markNotificationRead } from "@/lib/repositories/notification.repository"

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  await markNotificationRead(session.user.id, id)
  await invalidateUnreadCount(session.user.id)
  return success({ updated: true })
}
