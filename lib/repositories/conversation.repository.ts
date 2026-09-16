import { prisma } from "@/lib/prisma"

export async function findConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      },
    },
  })
}

export async function findConversationForMembers(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds)]

  return prisma.conversation.findFirst({
    where: {
      members: {
        every: { userId: { in: uniqueUserIds } },
        some: { userId: uniqueUserIds[0] },
      },
    },
    include: { members: true },
  }).then((conversation) =>
    conversation?.members.length === uniqueUserIds.length &&
    uniqueUserIds.every((userId) =>
      conversation.members.some((member) => member.userId === userId)
    )
      ? conversation
      : null
  )
}

export async function createConversationRecord(userIds: string[]) {
  return prisma.conversation.create({
    data: {
      members: {
        create: userIds.map((userId) => ({ userId, role: "MEMBER" })),
      },
    },
    include: { members: true },
  })
}

export async function createGroupConversation(
  creatorId: string,
  name: string,
  userIds: string[]
) {
  const uniqueUserIds = [...new Set([creatorId, ...userIds])]

  return prisma.conversation.create({
    data: {
      name,
      isGroup: true,
      members: {
        create: uniqueUserIds.map((userId) => ({
          userId,
          role: userId === creatorId ? "ADMIN" : "MEMBER",
        })),
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      },
    },
  })
}
