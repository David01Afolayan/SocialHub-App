import { prisma } from "@/lib/prisma"

export async function findMessagesByConversationId(
  conversationId: string,
  limit = 30,
  cursor?: string
) {
  return prisma.chatMessage.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: { id: true, name: true, username: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 100),
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })
}

export async function createMessageRecord(data: {
  conversationId: string
  senderId: string
  receiverId: string
  content: string
}) {
  return prisma.chatMessage.create({ data })
}
