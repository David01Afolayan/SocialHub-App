import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { redisRateLimit } from "@/lib/rate-limit"
import { searchEverything } from "@/lib/services/search.service"
import { searchSchema } from "@/lib/validations/search"

export async function GET(request: Request) {
  const parsed = searchSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) return failure("Invalid search request.", 400, "INVALID_SEARCH")

  const session = await auth()
  const identifier = session?.user?.id ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous"
  const rate = await redisRateLimit(`search:${identifier}`, 60, 60)
  if (!rate.allowed) return failure("Too many search requests.", 429, "RATE_LIMITED")

  const { q, type, limit, cursor } = parsed.data
  const results = await searchEverything(q, limit, type, cursor)
  return success({ query: q, type, ...results })
}
