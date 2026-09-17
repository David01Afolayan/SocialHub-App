"use client"

import { useCallback, useEffect, useState } from "react"
import CreatePost from "@/components/posts/CreatePost"
import PostCard from "@/components/posts/PostCard"
import { getFeed, type FeedPost } from "@/lib/feed-api"

export default function HomePage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [error, setError] = useState("")

  const loadFeed = useCallback(async (cursor?: string) => {
    try {
      setError("")
      if (cursor) setLoadingMore(true)
      else setLoading(true)
      const result = await getFeed(cursor)
      setPosts((current) => cursor ? [...current, ...result.items] : result.items)
      setNextCursor(result.nextCursor)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load feed")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    void loadFeed()
  }, [loadFeed])

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white dark:bg-gray-950">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 p-4 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
        <h1 className="text-xl font-bold">Home</h1>
      </header>

      <CreatePost onCreated={() => void loadFeed()} />

      {error && <p className="border-b border-red-100 bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center">
          <h2 className="font-semibold">No posts yet</h2>
          <p className="mt-2 text-sm text-gray-500">Follow people and create your first post.</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
          {nextCursor && (
            <div className="p-6 text-center">
              <button
                onClick={() => void loadFeed(nextCursor)}
                disabled={loadingMore}
                className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
