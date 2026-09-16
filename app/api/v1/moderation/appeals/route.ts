import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const body = await request.json()
  if (typeof body.moderationResultId !== "string" || typeof body.reason !== "string" || !body.reason.trim()) {
    return failure("Moderation result and reason are required.", 400, "INVALID_APPEAL")
  }
  const result = await prisma.moderationResult.findUnique({ where: { id: body.moderationResultId } })
  if (!result) return failure("Moderation result not found.", 404, "NOT_FOUND")
  let ownerId: string | null = null
  if (result.targetType === "POST") {
    ownerId = (await prisma.post.findUnique({ where: { id: result.targetId }, select: { authorId: true } }))?.authorId ?? null
  } else if (result.targetType === "COMMENT") {
    ownerId = (await prisma.comment.findUnique({ where: { id: result.targetId }, select: { userId: true } }))?.userId ?? null
  } else if (result.targetType === "MESSAGE") {
    ownerId = (await prisma.chatMessage.findUnique({ where: { id: result.targetId }, select: { senderId: true } }))?.senderId ?? null
  } else if (result.targetType === "PROFILE") {
    ownerId = result.targetId
  }
  if (ownerId !== session.user.id) return failure("You cannot appeal this moderation result.", 403, "FORBIDDEN")
  const appeal = await prisma.moderationAppeal.create({
    data: { userId: session.user.id, moderationResultId: result.id, reason: body.reason.trim() },
  })
  return success({ appeal }, 201)
}
