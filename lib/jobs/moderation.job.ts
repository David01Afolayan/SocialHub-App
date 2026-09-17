import { moderationQueue } from "@/lib/queues/moderation.queue"
import { moderateContent } from "@/lib/services/moderation.service"

type ModerationJob = {
  targetType: "POST"
  targetId: string
  content: string
}

function hasUsableRedisUrl() {
  const value = process.env.REDIS_URL?.trim()
  if (!value) return false

  try {
    const hostname = new URL(value).hostname
    return !["localhost", "127.0.0.1", "::1"].includes(hostname)
  } catch {
    return false
  }
}

export async function queueModeration(data: ModerationJob) {
  if (!hasUsableRedisUrl()) {
    console.warn("MODERATION_QUEUE_UNAVAILABLE", "A reachable REDIS_URL is not configured; moderating inline.")
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
