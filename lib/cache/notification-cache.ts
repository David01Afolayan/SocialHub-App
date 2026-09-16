import { cacheKeys, deleteCache, getCache, setCache } from "@/lib/cache"

export function getCachedUnreadCount(userId: string) {
  return getCache<number>(cacheKeys.unreadNotifications(userId))
}

export function cacheUnreadCount(userId: string, count: number) {
  return setCache(cacheKeys.unreadNotifications(userId), count, 30)
}

export function invalidateUnreadCount(userId: string) {
  return deleteCache(cacheKeys.unreadNotifications(userId))
}
