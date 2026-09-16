import { Queue } from "bullmq"
import { QUEUE_NAMES } from "@/lib/queues/config"
import { createQueueOptions } from "@/lib/queues/queue-options"

export const notificationQueue = new Queue(
  QUEUE_NAMES.NOTIFICATIONS,
  createQueueOptions(3, 2000, 1000)
)
