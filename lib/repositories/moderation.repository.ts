import { prisma } from "@/lib/prisma"

export function createModerationResult(data: {
  targetType: string
  targetId: string
  decision: string
  score: number
  reasons: string[]
}) {
  return prisma.moderationResult.create({ data: { ...data, reasons: data.reasons } })
}

export function getPendingModerationResults() {
  return prisma.moderationResult.findMany({
    where: { decision: "REVIEW", reviewed: false },
    orderBy: { createdAt: "asc" },
    take: 100,
  })
}
