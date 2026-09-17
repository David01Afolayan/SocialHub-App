import { calculateModerationRisk } from "@/lib/moderation/risk"
import { prisma } from "@/lib/prisma"

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

async function moderateInline(data: ModerationJob) {
  const result = calculateModerationRisk(data.content)
  await prisma.post.update({
    where: { id: data.targetId },
    data: {
      moderationStatus:
        result.decision === "ALLOW"
          ? "APPROVED"
          : result.decision === "BLOCK"
            ? "REJECTED"
            : "PENDING_REVIEW",
    },
  })
  return result
}

export async function queueModeration(data: ModerationJob) {
  if (!hasUsableRedisUrl()) {
    console.warn("MODERATION_QUEUE_UNAVAILABLE", "A reachable REDIS_URL is not configured; moderating inline.")
    return moderateInline(data)
  }

  try {
    const { moderationQueue } = await import("@/lib/queues/moderation.queue")
    return await moderationQueue.add("moderate-content", data, {
      jobId: `moderation:${data.targetType}:${data.targetId}`,
    })
  } catch (error) {
    console.error("MODERATION_QUEUE_ERROR", error)
    return moderateInline(data)
  }
}
