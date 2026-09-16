import { prisma } from "@/lib/prisma"

export async function findPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true,
        },
      },
    },
  })
}

export async function createPostRecord(data: {
  content?: string
  mediaUrl?: string
  mediaUrls?: string[]
  authorId: string
  published?: boolean
  scheduledAt?: Date | null
}) {
  return prisma.post.create({
    data: {
      content: data.content,
      mediaUrl: data.mediaUrl,
      mediaUrls: data.mediaUrls ?? [],
      authorId: data.authorId,
      published: data.published ?? true,
      scheduledAt: data.scheduledAt ?? null,
    },
  })
}

export async function updatePostRecord(
  id: string,
  data: {
    content?: string
    mediaUrl?: string
    mediaUrls?: string[]
    published?: boolean
    scheduledAt?: Date | null
  }
) {
  return prisma.post.update({
    where: { id },
    data,
  })
}

export async function deletePostRecord(id: string) {
  return prisma.post.delete({
    where: { id },
  })
}
