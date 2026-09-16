import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { deleteSearchHistory, getRecentSearches, saveSearch } from "@/lib/repositories/search-history.repository"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  return success({ searches: await getRecentSearches(session.user.id) })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const body = await request.json()
  if (typeof body.query !== "string" || !body.query.trim() || body.query.length > 100) {
    return failure("Invalid search query.", 400, "INVALID_QUERY")
  }
  return success({ search: await saveSearch(session.user.id, body.query) }, 201)
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  await deleteSearchHistory(session.user.id)
  return success({ deleted: true })
}
