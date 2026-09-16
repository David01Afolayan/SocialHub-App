import { redis } from "@/lib/redis"

export async function markPostSeen(userId: string, postId: string) {
  const key = `seen-posts:${userId}`
  await redis.sadd(key, postId)
  await redis.expire(key, 60 * 60 * 24 * 30)
}

export function getSeenPosts(userId: string) {
  return redis.smembers(`seen-posts:${userId}`)
}
