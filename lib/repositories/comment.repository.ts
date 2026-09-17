import { prisma } from "@/lib/prisma"

const userSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} as const

export async function createComment(data: {
  postId: string
  userId: string
  content: string
  parentId?: string | null
}) {
  return prisma.comment.create({
    data: {
      postId: data.postId,
      userId: data.userId,
      content: data.content,
      parentId: data.parentId ?? null,
      moderationStatus: "APPROVED",
    },
    include: { user: { select: userSelect } },
  })
}

export function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId, parentId: null, moderationStatus: "APPROVED" },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: userSelect },
      replies: {
        where: { moderationStatus: "APPROVED" },
        orderBy: { createdAt: "asc" },
        include: { user: { select: userSelect } },
      },
    },
  })
}

export function findCommentById(id: string) {
  return prisma.comment.findUnique({
    where: { id },
    include: { post: { select: { id: true } } },
  })
}

export function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } })
}
