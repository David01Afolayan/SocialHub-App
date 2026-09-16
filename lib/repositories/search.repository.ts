import { prisma } from "@/lib/prisma"

const userSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} as const

export async function searchUsers(query: string, limit = 10) {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    select: userSelect,
    take: limit,
    orderBy: { name: "asc" },
  })
}

export async function searchPosts(query: string, limit = 20, cursor?: string) {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      visibility: "PUBLIC",
      moderationStatus: "APPROVED",
      content: { contains: query, mode: "insensitive" },
    },
    select: { id: true, content: true, createdAt: true, author: { select: userSelect } },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
  })
  return {
    items: posts.slice(0, limit),
    nextCursor: posts.length > limit ? posts[limit - 1]?.id ?? null : null,
  }
}

export async function searchHashtags(query: string, limit = 10) {
  return prisma.hashtag.findMany({
    where: { name: { contains: query.replace(/^#/, ""), mode: "insensitive" } },
    select: { id: true, name: true },
    take: limit,
    orderBy: { name: "asc" },
  })
}

export async function getHashtagByName(name: string) {
  return prisma.hashtag.findUnique({ where: { name: name.replace(/^#/, "").toLowerCase() } })
}

export async function getPostsByHashtag(hashtagId: string, limit = 20) {
  return prisma.post.findMany({
    where: {
      published: true,
      visibility: "PUBLIC",
      moderationStatus: "APPROVED",
      hashtags: { some: { hashtagId } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { author: { select: userSelect } },
  })
}
