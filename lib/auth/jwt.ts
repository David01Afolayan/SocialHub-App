import { SignJWT, jwtVerify } from "jose"

function getSecretKey() {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured")
  return new TextEncoder().encode(secret)
}

export async function createAccessToken(userId: string) {
  return new SignJWT({ userId, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecretKey())
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (payload.type !== "access" || typeof payload.userId !== "string") return null
    return { userId: payload.userId }
  } catch {
    return null
  }
}
