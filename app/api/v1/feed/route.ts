import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { getPersonalizedFeed } from "@/lib/services/personalized-feed.service"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  return success({ items: await getPersonalizedFeed(session.user.id) })
}
