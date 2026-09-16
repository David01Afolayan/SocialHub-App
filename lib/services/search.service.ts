import { searchHashtags, searchPosts, searchUsers } from "@/lib/repositories/search.repository"

export async function searchEverything(query: string, limit = 20, type = "ALL", cursor?: string) {
  const [users, posts, hashtags] = await Promise.all([
    type === "POSTS" || type === "HASHTAGS" ? Promise.resolve([]) : searchUsers(query, 10),
    type === "USERS" || type === "HASHTAGS" ? Promise.resolve({ items: [], nextCursor: null }) : searchPosts(query, limit, cursor),
    type === "USERS" || type === "POSTS" ? Promise.resolve([]) : searchHashtags(query, 10),
  ])
  return { users, posts: posts.items, hashtags, nextCursor: posts.nextCursor }
}
