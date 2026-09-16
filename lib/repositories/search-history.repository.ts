import { prisma } from "@/lib/prisma"

export function saveSearch(userId: string, query: string) {
  return prisma.searchHistory.create({ data: { userId, query: query.trim() } })
}

export function getRecentSearches(userId: string) {
  return prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, query: true, createdAt: true },
  })
}

export function deleteSearchHistory(userId: string) {
  return prisma.searchHistory.deleteMany({ where: { userId } })
}
