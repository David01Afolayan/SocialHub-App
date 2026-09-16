import { prisma } from "@/lib/prisma"

export function updateInterest(userId: string, topic: string, amount: number) {
  return prisma.userInterest.upsert({
    where: { userId_topic: { userId, topic } },
    create: { userId, topic, score: amount },
    update: { score: { increment: amount } },
  })
}
