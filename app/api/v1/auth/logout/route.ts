import { failure, success } from "@/lib/api/response"
import { deleteApiSession } from "@/lib/services/api-session.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const refreshToken = String(body.refreshToken ?? "")
    if (refreshToken) await deleteApiSession(refreshToken)
    return success({ loggedOut: true })
  } catch (error) {
    console.error("LOGOUT_ERROR", error)
    return failure("Unable to logout.", 500, "LOGOUT_FAILED")
  }
}
