import bcrypt from "bcrypt"
import { failure, success } from "@/lib/api/response"
import { createAccessToken } from "@/lib/auth/jwt"
import { prisma } from "@/lib/prisma"
import { createApiSession } from "@/lib/services/api-session.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")
    if (!email || !password) return failure("Email and password are required.", 400, "INVALID_INPUT")
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      return failure("Invalid email or password.", 401, "INVALID_CREDENTIALS")
    }
    const accessToken = await createAccessToken(user.id)
    const session = await createApiSession(user.id)
    return success({
      accessToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      user: { id: user.id, name: user.name, email: user.email, image: user.image },
    })
  } catch (error) {
    console.error("LOGIN_ERROR", error)
    return failure("Unable to login.", 500, "LOGIN_FAILED")
  }
}
