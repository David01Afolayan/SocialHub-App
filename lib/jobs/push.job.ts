import type { Job } from "bullmq"
import { pushQueue } from "@/lib/queues/push.queue"
import type { PushNotificationJob } from "@/types/jobs"

export async function queuePushNotification(job: PushNotificationJob) {
  return pushQueue.add("send-push", job, {
    jobId: job.notificationId
      ? `notification-${job.notificationId}`
      : undefined,
  })
}

export type PushJob = Job<PushNotificationJob>
