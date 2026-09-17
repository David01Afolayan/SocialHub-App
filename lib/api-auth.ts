import { auth } from "@/auth"
import type { NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/auth/jwt"

export async function requireAdminUser() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN")
  }
  return session.user
}

export async function requireApiUser(request: NextRequest) {
  const authorization = request.headers.get("authorization")
  if (authorization?.startsWith("Bearer ")) {
    const payload = await verifyAccessToken(authorization.slice(7))
    if (payload) return { id: payload.userId, method: "token" as const }
  }

  const session = await auth()
  if (session?.user?.id) return { id: session.user.id, method: "session" as const }
  throw new Error("UNAUTHORIZED")
}
