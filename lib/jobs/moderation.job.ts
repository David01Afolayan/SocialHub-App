import { moderationQueue } from "@/lib/queues/moderation.queue"
import { moderateContent } from "@/lib/services/moderation.service"

type ModerationJob = {
  targetType: "POST"
  targetId: string
  content: string
}

export async function queueModeration(data: ModerationJob) {
  if (!process.env.REDIS_URL) {
    console.warn("MODERATION_QUEUE_UNAVAILABLE", "REDIS_URL is not configured; moderating inline.")
    return moderateContent(data)
  }

  try {
    return await moderationQueue.add("moderate-content", data, {
      jobId: `moderation:${data.targetType}:${data.targetId}`,
    })
  } catch (error) {
    console.error("MODERATION_QUEUE_ERROR", error)
    return moderateContent(data)
  }
}
