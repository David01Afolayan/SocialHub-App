import { redis } from "@/lib/redis"

export async function redisRateLimit(key: string, limit: number, windowSeconds: number) {
  try {
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, windowSeconds)
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
  } catch (error) {
    console.error("RATE_LIMIT_ERROR", { key, error })
    return { allowed: true, remaining: limit }
  }
}
