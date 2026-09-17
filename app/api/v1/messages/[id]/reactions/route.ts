import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"
import { requireConversationMember } from "@/lib/services/conversation-auth.service"

const allowedReactions = new Set(["LIKE", "LOVE", "LAUGH", "FIRE", "WOW", "SAD"])

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const message = await prisma.chatMessage.findUnique({ where: { id }, select: { conversationId: true } })
  if (!message?.conversationId) return failure("Message not found.", 404, "NOT_FOUND")
  try {
    await requireConversationMember(message.conversationId, session.user.id)
  } catch {
    return failure("Forbidden.", 403, "FORBIDDEN")
  }
  const body = await request.json()
  if (typeof body?.type !== "string" || !allowedReactions.has(body.type)) {
    return failure("Invalid reaction.", 400, "INVALID_REACTION")
  }
  const reaction = await prisma.messageReaction.upsert({
    where: { messageId_userId_type: { messageId: id, userId: session.user.id, type: body.type } },
    create: { messageId: id, userId: session.user.id, type: body.type },
    update: {},
  })
  return success({ reaction })
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  const message = await prisma.chatMessage.findUnique({ where: { id }, select: { conversationId: true } })
  if (!message?.conversationId) return failure("Message not found.", 404, "NOT_FOUND")
  try {
    await requireConversationMember(message.conversationId, session.user.id)
  } catch {
    return failure("Forbidden.", 403, "FORBIDDEN")
  }
  const type = new URL(request.url).searchParams.get("type")
  if (!type) return failure("Reaction type is required.", 400, "REACTION_TYPE_REQUIRED")
  await prisma.messageReaction.deleteMany({ where: { messageId: id, userId: session.user.id, type } })
  return success({ deleted: true })
}
