import { prisma } from "@/lib/prisma"

export function getNotificationPreferences(userId: string) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  })
}

export function updateNotificationPreferences(
  userId: string,
  data: {
    likes?: boolean
    comments?: boolean
    follows?: boolean
    mentions?: boolean
    messages?: boolean
    reposts?: boolean
    pushEnabled?: boolean
    emailEnabled?: boolean
  }
) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  })
}
