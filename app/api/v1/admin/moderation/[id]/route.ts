import { failure, success } from "@/lib/api/response"
import { requireAdminUser } from "@/lib/api-auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminUser()
    const { id } = await context.params
    const body = await request.json()
    if (!["ALLOW", "BLOCK"].includes(body.decision)) return failure("Invalid moderation decision.", 400, "INVALID_DECISION")
    const result = await prisma.moderationResult.update({
      where: { id },
      data: { decision: body.decision, reviewed: true, reviewedById: admin.id, reviewedAt: new Date() },
    })
    if (result.targetType === "POST") {
      await prisma.post.update({
        where: { id: result.targetId },
        data: { moderationStatus: body.decision === "ALLOW" ? "APPROVED" : "REJECTED" },
      })
    }
    return success({ result })
  } catch {
    return failure("Unable to review moderation result.", 400, "MODERATION_REVIEW_FAILED")
  }
}
