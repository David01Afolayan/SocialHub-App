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
      replyTo: {
        select: {
          id: true,
          content: true,
          sender: { select: { id: true, name: true, username: true } },
        },
      },
      reactions: true,
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
  type?: string
  replyToId?: string | null
  mediaId?: string | null
}) {
  return prisma.chatMessage.create({
    data: {
      ...data,
      type: data.type ?? "TEXT",
      replyToId: data.replyToId ?? null,
      mediaId: data.mediaId ?? null,
    },
    include: {
      sender: { select: { id: true, name: true, username: true, image: true } },
      replyTo: {
        select: {
          id: true,
          content: true,
          sender: { select: { id: true, name: true, username: true } },
        },
      },
      reactions: true,
    },
  })
}
