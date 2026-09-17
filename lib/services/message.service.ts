import {
  createMessageRecord,
  findMessagesByConversationId,
} from "@/lib/repositories/message.repository"
import { getConversation } from "@/lib/services/conversation.service"
import { prisma } from "@/lib/prisma"
import { notifyConversationMembers } from "@/lib/services/message-notification.service"

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
  type?: string
  replyToId?: string | null
  mediaId?: string | null
}) {
  const conversation = await getConversation(
    input.conversationId,
    input.senderId
  )
  const content = input.content.trim()

  if (!content && !input.mediaId) {
    throw new Error("MESSAGE_EMPTY")
  }

  if (content.length > 2000) {
    throw new Error("MESSAGE_TOO_LONG")
  }

  let messageType = input.type ?? "TEXT"
  if (input.mediaId) {
    const media = await prisma.media.findUnique({
      where: { id: input.mediaId },
      select: { mimeType: true, uploadedById: true },
    })
    if (!media || media.uploadedById !== input.senderId) {
      throw new Error("MEDIA_FORBIDDEN")
    }
    messageType = media.mimeType.startsWith("image/")
      ? "IMAGE"
      : media.mimeType.startsWith("video/")
        ? "VIDEO"
        : media.mimeType.startsWith("audio/")
          ? "AUDIO"
          : "DOCUMENT"
  }

  const receiver = conversation.members.find(
    (member) => member.userId !== input.senderId
  )

  if (!receiver) {
    throw new Error("CONVERSATION_REQUIRES_MULTIPLE_MEMBERS")
  }

  const message = await createMessageRecord({
    conversationId: input.conversationId,
    senderId: input.senderId,
    receiverId: receiver.userId,
    content,
    type: messageType,
    replyToId: input.replyToId,
    mediaId: input.mediaId,
  })
  await notifyConversationMembers(input.conversationId, input.senderId, message.id)
  return message
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
