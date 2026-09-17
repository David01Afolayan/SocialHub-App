import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { redis } from "@/lib/redis"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  try {
    await redis.set(`presence:${session.user.id}`, "online", "EX", 60)
    return success({ online: true })
  } catch (error) {
    console.error("PRESENCE_HEARTBEAT_ERROR", error)
    return failure("Failed to update presence.", 500, "INTERNAL_ERROR")
  }
}
