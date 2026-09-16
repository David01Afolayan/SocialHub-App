import { Queue } from "bullmq"
import { redis } from "@/lib/redis"

export const moderationQueue = new Queue("moderation", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
})
