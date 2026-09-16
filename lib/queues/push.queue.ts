import { Queue } from "bullmq"
import { QUEUE_NAMES } from "@/lib/queues/config"
import { createQueueOptions } from "@/lib/queues/queue-options"

export const pushQueue = new Queue(
  QUEUE_NAMES.PUSH,
  createQueueOptions(5, 3000, 1000)
)
