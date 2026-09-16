import { prisma } from "@/lib/prisma"

export async function getTrendingHashtags() {
  const grouped = await prisma.postHashtag.groupBy({
    by: ["hashtagId"],
    where: { post: { published: true, visibility: "PUBLIC", moderationStatus: "APPROVED" } },
    _count: { hashtagId: true },
    orderBy: { _count: { hashtagId: "desc" } },
    take: 20,
  })
  return prisma.hashtag.findMany({ where: { id: { in: grouped.map((item) => item.hashtagId) } } })
}
