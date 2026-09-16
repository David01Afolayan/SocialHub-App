import { failure, success } from "@/lib/api/response"
import { getCachedSuggestions, cacheSuggestions } from "@/lib/cache/search-cache"
import { getSearchSuggestions } from "@/lib/services/search-suggestion.service"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? ""
  if (!query || query.length > 100) return failure("Invalid suggestion query.", 400, "INVALID_QUERY")
  const cached = await getCachedSuggestions(query)
  if (cached) return success(cached)
  const suggestions = await getSearchSuggestions(query)
  await cacheSuggestions(query, suggestions)
  return success(suggestions)
}
