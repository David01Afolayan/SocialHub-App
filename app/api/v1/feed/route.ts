import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { getPersonalizedFeed } from "@/lib/services/personalized-feed.service"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const cursor = new URL(request.url).searchParams.get("cursor") ?? undefined
  return success(await getPersonalizedFeed(session.user.id, cursor))
}
