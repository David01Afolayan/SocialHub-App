import { moderationQueue } from "@/lib/queues/moderation.queue"

export function queueModeration(data: { targetType: string; targetId: string; content: string }) {
  return moderationQueue.add("moderate-content", data, { jobId: `moderation:${data.targetType}:${data.targetId}` })
}
