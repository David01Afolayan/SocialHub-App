"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type SearchResponse = {
  data?: {
    query: string
    users: Array<{ id: string; name: string | null; username: string | null }>
    posts: Array<{ id: string; content: string | null }>
    hashtags: Array<{ id: string; name: string }>
  }
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(initialQuery)
  const [result, setResult] = useState<SearchResponse["data"]>()

  useEffect(() => {
    if (!query.trim()) {
      setResult(undefined)
      return
    }
    const timer = window.setTimeout(async () => {
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const body = (await response.json()) as SearchResponse
        setResult(body.data)
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query])

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Explore SocialHub</h1>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search users, posts, and hashtags"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
        aria-label="Search SocialHub"
      />
      {result && (
        <div className="space-y-6">
          <section>
            <h2 className="font-semibold">People</h2>
            {result.users.map((user) => <p key={user.id} className="py-1">@{user.username ?? user.name}</p>)}
          </section>
          <section>
            <h2 className="font-semibold">Hashtags</h2>
            {result.hashtags.map((hashtag) => <p key={hashtag.id} className="py-1">#{hashtag.name}</p>)}
          </section>
          <section>
            <h2 className="font-semibold">Posts</h2>
            {result.posts.map((post) => <p key={post.id} className="border-b border-slate-100 py-2">{post.content}</p>)}
          </section>
        </div>
      )}
    </main>
  )
}
