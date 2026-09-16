import { getPusher } from "@/lib/pusher"

export async function publishUserEvent(
  userId: string,
  event: string,
  data: unknown,
) {
  try {
    await getPusher().trigger(`private-user-${userId}`, event, data)
  } catch (error) {
    console.error("REALTIME_PUBLISH_ERROR", { userId, event, error })
  }
}
