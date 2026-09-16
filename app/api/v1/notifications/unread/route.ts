import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { cacheUnreadCount, getCachedUnreadCount } from "@/lib/cache/notification-cache"
import { countUnreadNotifications } from "@/lib/repositories/notification.repository"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const cached = await getCachedUnreadCount(session.user.id)
  if (cached !== null) return success({ count: cached })
  const count = await countUnreadNotifications(session.user.id)
  await cacheUnreadCount(session.user.id, count)
  return success({ count })
}
