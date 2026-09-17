import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const REFRESH_TOKEN_DAYS = 30

export async function createApiSession(userId: string) {
  const refreshToken = crypto.randomBytes(48).toString("hex")
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS)
  const session = await prisma.apiSession.create({ data: { userId, refreshToken, expiresAt } })
  return { id: session.id, refreshToken, expiresAt: session.expiresAt }
}

export function findApiSession(refreshToken: string) {
  return prisma.apiSession.findUnique({ where: { refreshToken }, include: { user: true } })
}

export async function deleteApiSession(refreshToken: string) {
  await prisma.apiSession.deleteMany({ where: { refreshToken } })
}

export async function deleteUserApiSessions(userId: string) {
  await prisma.apiSession.deleteMany({ where: { userId } })
}
