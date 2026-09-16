import { prisma } from "@/lib/prisma"

export async function registerDevice(data: {
  userId: string
  token: string
  platform: string
  deviceId?: string | null
}) {
  return prisma.userDevice.upsert({
    where: { token: data.token },
    create: {
      ...data,
      active: true,
      lastUsedAt: new Date(),
    },
    update: {
      userId: data.userId,
      platform: data.platform,
      deviceId: data.deviceId,
      active: true,
      lastUsedAt: new Date(),
    },
  })
}

export function getActiveDevices(userId: string) {
  return prisma.userDevice.findMany({
    where: { userId, active: true },
    orderBy: { lastUsedAt: "desc" },
  })
}

export function deactivateDevice(userId: string, token: string) {
  return prisma.userDevice.updateMany({
    where: { userId, token },
    data: { active: false },
  })
}
