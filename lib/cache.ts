import { redis } from "@/lib/redis"

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key)
    return value ? (JSON.parse(value) as T) : null
  } catch (error) {
    console.error("CACHE_GET_ERROR", { key, error })
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number) {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds)
  } catch (error) {
    console.error("CACHE_SET_ERROR", { key, error })
  }
}

export async function deleteCache(key: string) {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("CACHE_DELETE_ERROR", { key, error })
  }
}

export const cacheKeys = {
  unreadNotifications: (userId: string) => `notifications:unread:${userId}`,
}
