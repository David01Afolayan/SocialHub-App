import {
  createMessageRecord,
  findMessagesByConversationId,
} from "@/lib/repositories/message.repository"
import { getConversation } from "@/lib/services/conversation.service"
import { prisma } from "@/lib/prisma"

export async function getConversationMessages(
  conversationId: string,
  userId: string,
  cursor?: string
) {
  await getConversation(conversationId, userId)
  const messages = await findMessagesByConversationId(conversationId, 30, cursor)
  const nextCursor = messages.length === 30
    ? messages[messages.length - 1]?.id ?? null
    : null

  return { messages, nextCursor }
}

export async function sendMessage(input: {
  conversationId: string
  senderId: string
  content: string
}) {
  const conversation = await getConversation(
    input.conversationId,
    input.senderId
  )
  const content = input.content.trim()

  if (!content) {
    throw new Error("MESSAGE_EMPTY")
  }

  if (content.length > 2000) {
    throw new Error("MESSAGE_TOO_LONG")
  }

  const receiver = conversation.members.find(
    (member) => member.userId !== input.senderId
  )

  if (!receiver) {
    throw new Error("CONVERSATION_REQUIRES_MULTIPLE_MEMBERS")
  }

  return createMessageRecord({
    conversationId: input.conversationId,
    senderId: input.senderId,
    receiverId: receiver.userId,
    content,
  })
}

export async function markConversationRead(
  conversationId: string,
  userId: string
) {
  await getConversation(conversationId, userId)

  return prisma.chatMessage.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: {
      readAt: new Date(),
      read: true,
    },
  })
}
