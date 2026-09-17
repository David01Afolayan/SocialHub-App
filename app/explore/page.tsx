"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

type SearchResponse = {
  data?: {
    query: string
    users: Array<{ id: string; name: string | null; username: string | null; image?: string | null }>
    posts: Array<{ id: string; content: string | null; createdAt: string; author: { id: string; name: string | null; username: string | null } }>
    hashtags: Array<{ id: string; name: string }>
    nextCursor: string | null
  }
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") ?? ""
  const initialType = searchParams.get("type") ?? "ALL"
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)
  const [result, setResult] = useState<SearchResponse["data"]>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResult(undefined)
      return
    }
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}&type=${type}`)
        if (response.ok) {
          const body = (await response.json()) as SearchResponse
          setResult(body.data)
          router.replace(`/explore?q=${encodeURIComponent(query)}&type=${type}`, { scroll: false })
        }
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query, type, router])

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Explore SocialHub</h1>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users, posts, and hashtags"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          aria-label="Search SocialHub"
        />
        {loading && <span className="self-center text-sm text-slate-500">Searching...</span>}
      </div>
      <div className="flex gap-2">
        {["ALL", "USERS", "POSTS", "HASHTAGS"].map((value) => (
          <button
            key={value}
            onClick={() => setType(value)}
            className={type === value ? "rounded-full bg-black px-3 py-1 text-xs text-white" : "rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"}
          >
            {value[0] + value.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      {result && (
        <div className="space-y-6">
          {(type === "ALL" || type === "USERS") && <section>
            <h2 className="font-semibold">People</h2>
            {result.users.length === 0 ? <p className="py-2 text-sm text-slate-500">No people found.</p> : result.users.map((user) => (
              <Link key={user.id} href={user.username ? `/profile/${user.username}` : "#"} className="block py-1 hover:underline">@{user.username ?? user.name ?? "user"}</Link>
            ))}
          </section>}
          {(type === "ALL" || type === "HASHTAGS") && <section>
            <h2 className="font-semibold">Hashtags</h2>
            {result.hashtags.length === 0 ? <p className="py-2 text-sm text-slate-500">No hashtags found.</p> : result.hashtags.map((hashtag) => (
              <Link key={hashtag.id} href={`/explore?q=${encodeURIComponent(hashtag.name)}&type=HASHTAGS`} className="block py-1 text-blue-600 hover:underline">#{hashtag.name}</Link>
            ))}
          </section>}
          {(type === "ALL" || type === "POSTS") && <section>
            <h2 className="font-semibold">Posts</h2>
            {result.posts.length === 0 ? <p className="py-2 text-sm text-slate-500">No posts found.</p> : result.posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`} className="block border-b border-slate-100 py-2 hover:bg-slate-50">
                <span className="text-sm">{post.content}</span>
                <span className="mt-1 block text-xs text-slate-500">@{post.author.username ?? post.author.name ?? "user"} · {new Date(post.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </section>}
        </div>
      )}
    </main>
  )
}
