import { prisma } from "@/lib/prisma"

export function canManagePost(userId: string, authorId: string) {
  return userId === authorId
}

export function canManageComment(userId: string, authorId: string) {
  return userId === authorId
}

export async function isConversationMember(userId: string, conversationId: string) {
  const member = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
    select: { id: true },
  })
  return Boolean(member)
}

export async function isUserBlocked(blockerId: string, blockedId: string) {
  const block = await prisma.userBlock.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } },
    select: { id: true },
  })
  return Boolean(block)
}
