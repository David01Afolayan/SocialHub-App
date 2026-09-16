import { calculateModerationRisk } from "@/lib/moderation/risk"
import { createModerationResult } from "@/lib/repositories/moderation.repository"
import { prisma } from "@/lib/prisma"
import type { ModerationTarget } from "@/types/moderation"

export async function moderateContent(data: {
  targetType: ModerationTarget
  targetId: string
  content: string
}) {
  const result = calculateModerationRisk(data.content)
  const record = await createModerationResult({ ...data, ...result })
  if (data.targetType === "POST") {
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
  }
  return { ...result, id: record.id }
}
