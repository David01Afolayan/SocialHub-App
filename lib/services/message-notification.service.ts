import { prisma } from "@/lib/prisma"
import { notifyUser } from "@/lib/services/activity-notification.service"

export async function notifyConversationMembers(
  conversationId: string,
  senderId: string,
  messageId: string,
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { members: true },
  })
  if (!conversation) return
  await Promise.all(
    conversation.members
      .filter((member) => member.userId !== senderId)
      .map((member) => notifyUser(member.userId, senderId, {
        type: "MESSAGE",
        title: "New message",
        message: "sent you a message",
        entityId: messageId,
        entityType: "MESSAGE",
      })),
  )
}
