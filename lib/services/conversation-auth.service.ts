import { prisma } from "@/lib/prisma"

export async function isConversationMember(conversationId: string, userId: string) {
  const member = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  })
  return Boolean(member)
}

export async function requireConversationMember(conversationId: string, userId: string) {
  const member = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
    include: { conversation: true },
  })
  if (!member) throw new Error("FORBIDDEN")
  return member
}
