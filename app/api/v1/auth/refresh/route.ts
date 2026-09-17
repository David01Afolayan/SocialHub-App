import { failure, success } from "@/lib/api/response"
import { createAccessToken } from "@/lib/auth/jwt"
import { findApiSession } from "@/lib/services/api-session.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const refreshToken = String(body.refreshToken ?? "")
    if (!refreshToken) return failure("Refresh token is required.", 400, "MISSING_REFRESH_TOKEN")
    const session = await findApiSession(refreshToken)
    if (!session) return failure("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN")
    if (session.expiresAt <= new Date()) return failure("Refresh token expired.", 401, "REFRESH_TOKEN_EXPIRED")
    return success({ accessToken: await createAccessToken(session.user.id), expiresIn: 900 })
  } catch (error) {
    console.error("REFRESH_TOKEN_ERROR", error)
    return failure("Unable to refresh session.", 500, "REFRESH_FAILED")
  }
}
