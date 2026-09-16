import { Worker } from "bullmq"
import { redis } from "@/lib/redis"
import { moderateContent } from "@/lib/services/moderation.service"

export const moderationWorker = new Worker("moderation", (job) => moderateContent(job.data), {
  connection: redis,
  concurrency: 10,
})

moderationWorker.on("completed", (job) => console.info("Moderation completed", { jobId: job.id }))
moderationWorker.on("failed", (job, error) => console.error("Moderation failed", { jobId: job?.id, error }))
