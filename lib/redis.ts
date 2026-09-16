import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis?: Redis
}

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379"

export const redis =
  globalForRedis.redis ??
  new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  })

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}
