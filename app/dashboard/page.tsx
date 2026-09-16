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

  const stats = [
    { label: "Planned posts", value: String(scheduledPosts.length), accent: "from-indigo-500 to-cyan-500" },
    { label: "Next publish", value: scheduledPosts[0] ? new Date(scheduledPosts[0].scheduledAt!).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "No schedule", accent: "from-violet-500 to-indigo-500" },
    { label: "Community reach", value: "+18.4%", accent: "from-emerald-500 to-teal-500" },
    { label: "Content health", value: "Healthy", accent: "from-sky-500 to-blue-500" },
  ]

  return (
    <main className="app-canvas px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="surface-card rounded-[30px] p-5 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Content calendar</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Scheduled posts</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">Keep the next publishing moments visible and intentional across your channels.</p>
            </div>
            <BackButton />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="metric-card rounded-[24px] p-5">
              <div className={`mb-4 h-10 w-10 rounded-2xl bg-gradient-to-r ${stat.accent}`} />
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="workspace-surface rounded-[30px] p-10 text-center">
            <p className="text-xl font-semibold text-slate-900">Your calendar is clear</p>
            <p className="mt-2 text-sm text-slate-500">Scheduled posts will appear here when you plan your next update.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <article key={post.id} className="workspace-surface rounded-[26px] p-5 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="section-tag">Scheduled</span>
                    <time className="mt-3 block text-xs font-black uppercase tracking-[0.18em] text-indigo-700">
                      {new Date(post.scheduledAt!).toLocaleString()}
                    </time>
                  </div>
                  <div className="status-pill">Queued</div>
                </div>
                <p className="mt-4 text-base leading-7 text-slate-700">{post.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
