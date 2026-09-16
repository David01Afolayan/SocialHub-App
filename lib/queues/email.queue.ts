import { Queue } from "bullmq"
import { QUEUE_NAMES } from "@/lib/queues/config"
import { createQueueOptions } from "@/lib/queues/queue-options"

export const emailQueue = new Queue(
  QUEUE_NAMES.EMAIL,
  createQueueOptions(4, 5000, 1000)
)
