import { searchHashtags, searchUsers } from "@/lib/repositories/search.repository"

export async function getSearchSuggestions(query: string) {
  const [users, hashtags] = await Promise.all([
    searchUsers(query, 5),
    searchHashtags(query, 5),
  ])
  return { users, hashtags }
}
