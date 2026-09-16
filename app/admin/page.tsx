"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Stats = {
  users: number; posts: number; comments: number; likes: number
  bookmarks: number; follows: number; messages: number; admins: number
}
type User = {
  id: string; name: string | null; email: string | null
  username: string | null; role: string; postCount: number; followerCount: number
}
type Post = {
  id: string; content: string | null; createdAt: string
  author: { name: string | null; username: string | null }
  likeCount: number; commentCount: number; bookmarkCount: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadAdminData = async () => {
    try {
      const responses = await Promise.all([
        fetch("/api/admin/stats", { cache: "no-store" }),
        fetch("/api/admin/users", { cache: "no-store" }),
        fetch("/api/admin/posts", { cache: "no-store" }),
      ])
      const data = await Promise.all(responses.map((response) => response.json()))
      if (responses.some((response) => !response.ok)) {
        setError(data.find((item) => item.error)?.error ?? "Admin access denied.")
        return
      }
      setStats(data[0])
      setUsers(data[1].users ?? [])
      setPosts(data[2].posts ?? [])
    } catch (loadError) {
      console.error("ADMIN_LOAD_ERROR", loadError)
      setError("Unable to load admin dashboard.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAdminData() }, [])

  const updateRole = async (user: User) => {
    const role = user.role === "ADMIN" ? "USER" : "ADMIN"
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    const data = await response.json()
    if (!response.ok) { alert(data.error || "Unable to update role"); return }
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: data.user.role } : item))
  }

  const deletePost = async (postId: string) => {
    if (!window.confirm("Delete this post permanently?")) return
    const response = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" })
    const data = await response.json()
    if (!response.ok) { alert(data.error || "Unable to delete post"); return }
    setPosts((current) => current.filter((post) => post.id !== postId))
    setStats((current) => current ? { ...current, posts: Math.max(0, current.posts - 1) } : current)
  }

  if (loading) return <main className="app-canvas min-h-screen p-8 text-slate-500">Loading admin dashboard...</main>
  if (error || !stats) {
    return <main className="app-canvas min-h-screen p-6"><div className="surface-card mx-auto max-w-xl rounded-2xl p-10 text-center">
      <div className="text-4xl">🔒</div><h1 className="mt-4 text-xl font-bold text-slate-900">Admin Access Required</h1>
      <p className="mt-2 text-sm text-slate-500">{error}</p><Link href="/" className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white">Back to SocialHub</Link>
    </div></main>
  }

  const cards = [
    ["Users", stats.users], ["Posts", stats.posts], ["Likes", stats.likes], ["Comments", stats.comments],
    ["Bookmarks", stats.bookmarks], ["Follows", stats.follows], ["Messages", stats.messages], ["Admins", stats.admins],
  ]

  return <main className="app-canvas min-h-screen px-4 py-8">
    <div className="mx-auto max-w-7xl">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">← Back to SocialHub</Link>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Platform management and moderation.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => <div key={label} className="metric-card rounded-2xl p-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-4 text-3xl font-bold text-slate-900">{value}</p></div>)}
      </section>
      <section className="surface-card mt-8 overflow-x-auto rounded-2xl">
        <div className="border-b border-slate-100 p-6"><h2 className="font-bold text-slate-900">User Management</h2></div>
        <table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="px-6 py-4">User</th><th className="px-6 py-4">Posts</th><th className="px-6 py-4">Followers</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Action</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id} className="border-b border-slate-50"><td className="px-6 py-4"><p className="font-semibold text-slate-900">{user.name ?? user.username ?? "Unknown User"}</p><p className="text-xs text-slate-500">{user.email}</p></td><td className="px-6 py-4">{user.postCount}</td><td className="px-6 py-4">{user.followerCount}</td><td className="px-6 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{user.role}</span></td><td className="px-6 py-4"><button onClick={() => updateRole(user)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:bg-slate-50">{user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}</button></td></tr>)}</tbody>
        </table>
      </section>
      <section className="surface-card mt-8 rounded-2xl">
        <div className="border-b border-slate-100 p-6"><h2 className="font-bold text-slate-900">Post Moderation</h2><p className="mt-1 text-sm text-slate-500">Review and remove published content.</p></div>
        <div className="divide-y divide-slate-100">{posts.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No posts found.</div> : posts.map((post) => <article key={post.id} className="flex flex-col justify-between gap-4 p-6 md:flex-row"><div><p className="font-semibold text-slate-900">{post.author.name ?? post.author.username ?? "Unknown User"}</p><p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{post.content || "Media post"}</p><div className="mt-3 flex gap-4 text-xs text-slate-400"><span>Likes {post.likeCount}</span><span>Comments {post.commentCount}</span><span>Bookmarks {post.bookmarkCount}</span><span>{new Date(post.createdAt).toLocaleDateString()}</span></div></div><button onClick={() => deletePost(post.id)} className="self-start rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100">Delete Post</button></article>)}</div>
      </section>
    </div>
  </main>
}
