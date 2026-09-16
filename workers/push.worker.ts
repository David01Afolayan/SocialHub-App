import { Worker } from "bullmq"
import { getActiveDevices } from "@/lib/repositories/device.repository"
import { QUEUE_NAMES } from "@/lib/queues/config"
import { logJobError } from "@/lib/queues/events"
import { redis } from "@/lib/redis"
import type { PushNotificationJob } from "@/types/jobs"

export const pushWorker = new Worker<PushNotificationJob>(
  QUEUE_NAMES.PUSH,
  async (job) => {
    const devices = await getActiveDevices(job.data.userId)

    for (const device of devices) {
      console.info("PUSH_PROVIDER_PENDING", {
        jobId: job.id,
        platform: device.platform,
        title: job.data.title,
      })
    }
  },
  { connection: redis, concurrency: 10 }
)

pushWorker.on("completed", (job) => {
  console.info("PUSH_JOB_COMPLETED", { jobId: job.id })
})

pushWorker.on("failed", (job, error) => {
  logJobError(QUEUE_NAMES.PUSH, job?.id, error)
})
