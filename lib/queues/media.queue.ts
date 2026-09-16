import { Queue } from "bullmq"
import { QUEUE_NAMES } from "@/lib/queues/config"
import { createQueueOptions } from "@/lib/queues/queue-options"

export const mediaQueue = new Queue(
  QUEUE_NAMES.MEDIA,
  createQueueOptions(3, 5000, 500)
)
