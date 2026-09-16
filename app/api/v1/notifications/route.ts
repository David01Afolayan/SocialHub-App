import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import {
  getNotifications,
  markAllNotificationsRead,
} from "@/lib/repositories/notification.repository"
import { invalidateUnreadCount } from "@/lib/cache/notification-cache"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const url = new URL(request.url)
  const result = await getNotifications(session.user.id, url.searchParams.get("cursor") ?? undefined)
  return success(result)
}

export async function PATCH() {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  await markAllNotificationsRead(session.user.id)
  await invalidateUnreadCount(session.user.id)
  return success({ updated: true })
}
