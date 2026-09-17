export type FeedPost = {
  id: string
  content: string | null
  mediaUrl: string | null
  mediaUrls: string[]
  createdAt: string
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  _count: {
    likes: number
    comments: number
    bookmarks: number
    reposts: number
  }
  liked: boolean
  bookmarked: boolean
}

export async function getFeed(cursor?: string) {
  const url = new URL("/api/v1/feed", window.location.origin)
  if (cursor) url.searchParams.set("cursor", cursor)
  const response = await fetch(url.toString())
  if (!response.ok) throw new Error("Failed to load feed")
  const body = await response.json()
  const data = body.data ?? body
  return {
    items: data.items as FeedPost[],
    nextCursor: data.nextCursor ?? null,
  }
}
