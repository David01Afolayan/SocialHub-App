import { prisma } from "@/lib/prisma"

export async function getNotifications(userId: string, cursor?: string, limit = 20) {
  const rows = await prisma.notification.findMany({
    where: { userId },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { id: true, name: true, username: true, image: true } } },
  })
  const hasMore = rows.length > limit
  const items = hasMore ? rows.slice(0, limit) : rows
  return { items, nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null }
}

export function countUnreadNotifications(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } })
}

export function markNotificationRead(userId: string, notificationId: string) {
  return prisma.notification.updateMany({ where: { id: notificationId, userId }, data: { read: true } })
}

export function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
}
