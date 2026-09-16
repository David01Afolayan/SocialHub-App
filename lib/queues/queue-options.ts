import type { QueueOptions } from "bullmq"
import { redis } from "@/lib/redis"

export function createQueueOptions(
  attempts: number,
  delay: number,
  removeOnComplete: number
): QueueOptions {
  return {
    connection: redis,
    defaultJobOptions: {
      attempts,
      backoff: { type: "exponential", delay },
      removeOnComplete,
      removeOnFail: 5000,
    },
  }
}
