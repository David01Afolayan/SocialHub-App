"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import BackButton from "@/components/back-button"

type Post = {
  id: string
  content: string
  status: string
  scheduledAt: string | null
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/posts?mine=1")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
  }, [session?.user?.id])

  if (status === "loading") return <main className="app-canvas flex items-center justify-center p-8 text-sm text-slate-500">Loading dashboard...</main>
  if (!session) return <main className="app-canvas flex items-center justify-center p-8 text-sm text-slate-500">Sign in to view your dashboard.</main>

  const scheduledPosts = posts
    .filter((post) => post.status === "SCHEDULED" && post.scheduledAt)
    .sort((a, b) => Date.parse(a.scheduledAt!) - Date.parse(b.scheduledAt!))

  return (
    <main className="app-canvas px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Content calendar</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Scheduled posts</h1>
          <p className="mt-2 text-sm text-slate-500">Keep the next publishing moments visible and intentional.</p>
        </div>
        <BackButton />
      </div>

      {scheduledPosts.length === 0 ? (
        <div className="workspace-surface rounded-[26px] p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">Your calendar is clear</p>
          <p className="mt-2 text-sm text-slate-500">Scheduled posts will appear here when you plan your next update.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledPosts.map((post) => (
            <article key={post.id} className="workspace-surface rounded-[22px] p-5">
              <time className="text-xs font-bold uppercase tracking-[0.15em] text-blue-700">
                {new Date(post.scheduledAt!).toLocaleString()}
              </time>
              <p className="mt-3 text-base leading-7 text-slate-700">{post.content}</p>
            </article>
          ))}
        </div>
      )}
      </div>
    </main>
  )
}