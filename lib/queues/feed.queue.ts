import { Queue } from "bullmq"
import { QUEUE_NAMES } from "@/lib/queues/config"
import { createQueueOptions } from "@/lib/queues/queue-options"

export const feedQueue = new Queue(
  QUEUE_NAMES.FEED,
  createQueueOptions(3, 2000, 1000)
)
