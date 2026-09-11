"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session } = useSession()
  const [post, setPost] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [comments, setComments] = useState<Record<string, any[]>>({})
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [search, setSearch] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [mediaUrlsInput, setMediaUrlsInput] = useState("")
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications")
    if (!res.ok) return
    const data = await res.json()
    setNotifications(data)
  }

  const fetchPosts = async (query = search) => {
    const searchParams = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""
    const res = await fetch(`/api/posts${searchParams}`)
    if (res.ok) {
      const data = await res.json()
      setPosts(data)
    }
  }

  useEffect(() => {
    if (!session) return
    fetchPosts()
    fetchNotifications()
  }, [session?.user?.id])

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const urls = await Promise.all(files.map((file) => readFileAsDataUrl(file)))
    setSelectedImages((current) => [...current, ...urls])
    event.target.value = ""
  }

  const handlePost = async () => {
    if (!post.trim() && selectedImages.length === 0) return

    const normalizedMediaUrls = [...selectedImages, ...mediaUrlsInput
      .split(/\n|,/) 
      .map((value) => value.trim()) 
      .filter(Boolean)]

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: post.trim(),
        mediaUrls: normalizedMediaUrls,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      }),
    })

    if (res.ok) {
      setPost("")
      setScheduledAt("")
      setMediaUrlsInput("")
      setSelectedImages([])
      await fetchPosts()
    } else {
      const body = await res.json().catch(() => ({}))
      alert(body.error || "Error posting")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return

    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
    if (res.ok) await fetchPosts()
  }

  const handleEdit = async (id: string) => {
    if (!editingContent.trim()) return
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editingContent }),
    })
    if (res.ok) {
      setEditingPostId(null)
      setEditingContent("")
      await fetchPosts()
    }
  }

  const loadComments = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/comments`)
    if (res.ok) {
      const data = await res.json()
      setComments((current) => ({ ...current, [postId]: data }))
    }
  }

  const handleComment = async (postId: string) => {
    const content = commentDrafts[postId]?.trim()
    if (!content) return

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    if (res.ok) {
      setCommentDrafts((current) => ({ ...current, [postId]: "" }))
      await loadComments(postId)
    }
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-50">
        <div className="w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-sky-500/10 backdrop-blur-sm">
          <div className="grid min-h-45 lg:grid-cols-2">
            <section className="flex flex-col justify-between bg-linear-to-br from-sky-600 via-blue-700 to-indigo-900 p-8 md:p-12">
              <div>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-sky-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  SocialHub Pro
                </div>

                <h1 className="max-w-md text-4xl font-bold tracking-tight md:text-5xl">
                  Build your audience with clarity and momentum.
                </h1>
                <p className="mt-5 max-w-lg text-base text-sky-100/80 md:text-lg">
                  A polished social publishing workspace for teams to plan, publish, and grow authentic conversations across every channel.
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["12k+", "Engaged users"],
                  ["4.9/5", "Average rating"],
                  ["24/7", "Community access"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/15 bg-slate-950/10 p-4">
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="mt-1 text-sm text-sky-100/80">{label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex items-center justify-center bg-slate-950 p-8 md:p-12">
              <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/60">
                <div className="mb-6 text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
                    Welcome back
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Sign in</h2>
                </div>

                <div className="space-y-3">
                  <a
                    href="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-sm hover:bg-slate-100"
                  >
                    Continue with email
                  </a>

                  <button
                    onClick={() => signIn("google")}
                    className="flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-base font-medium text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400"
                  >
                    Continue with Google
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                  <div className="h-px flex-1 bg-slate-700" />
                  Secure access
                  <div className="h-px flex-1 bg-slate-700" />
                </div>

                <p className="mt-6 text-center text-sm text-slate-400">
                  Join the platform to post updates, engage with your audience, and manage content in one place.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Create a post</h2>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {scheduledAt ? "Scheduled" : "Live"}
                </span>
              </div>

              <textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                placeholder="Share an update, idea, or announcement..."
                className="min-h-32.5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-sky-400"
              />

              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                    Add images
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-slate-600 md:items-end">
                    Schedule for
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800"
                    />
                  </label>
                </div>

                {selectedImages.length > 0 || mediaUrlsInput.trim() ? (
                  <div className="space-y-3">
                    {selectedImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {selectedImages.map((url, index) => (
                          <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img src={url} alt={`Upload preview ${index + 1}`} className="h-24 w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setSelectedImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                              className="absolute right-1 top-1 rounded-full bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <textarea
                      value={mediaUrlsInput}
                      onChange={(event) => setMediaUrlsInput(event.target.value)}
                      placeholder="Or paste image URLs, one per line"
                      className="min-h-20 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-sky-400"
                    />
                  </div>
                ) : null}

                <div className="flex justify-end">
                  <button
                    onClick={handlePost}
                    className="rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 hover:from-sky-500 hover:to-indigo-500"
                  >
                    {scheduledAt ? "Schedule post" : "Publish"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 md:p-6">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Community feed</h2>
                <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-400">
                    <circle cx="11" cy="11" r="6" />
                    <path d="M16 16L21 21" />
                  </svg>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search posts"
                    className="w-full border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button onClick={() => fetchPosts()} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700">
                    Search
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {posts.map((p) => (
                  <article key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {p.author?.image ? (
                          <img src={p.author.image} alt={p.author?.name ?? "User"} className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
                            {(p.author?.name ?? "U").slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{p.author?.name ?? "Unknown user"}</p>
                          <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      {p.authorId === session.user.id ? (
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => {
                              setEditingPostId(p.id)
                              setEditingContent(p.content)
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 hover:border-slate-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button
                          className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
                          onClick={async () => {
                            await fetch(`/api/users/${p.authorId}/follow`, { method: "POST" })
                            await fetchPosts()
                          }}
                        >
                          Follow
                        </button>
                      )}
                    </div>

                    {editingPostId === p.id ? (
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                        <input
                          value={editingContent}
                          onChange={(event) => setEditingContent(event.target.value)}
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(p.id)} className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500">
                            Save
                          </button>
                          <button onClick={() => setEditingPostId(null)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {p.content ? <p className="mb-4 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{p.content}</p> : null}
                        {p.mediaUrls?.length ? (
                          <div className={`mb-4 grid gap-2 ${p.mediaUrls.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                            {p.mediaUrls.map((url: string, index: number) => (
                              <img key={`${p.id}-${index}`} src={url} alt={`Post media ${index + 1}`} className="h-64 w-full rounded-2xl object-cover border border-slate-200" />
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}

                    <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-3 text-sm">
                      <button
                        onClick={async () => {
                          await fetch(`/api/posts/${p.id}/likes`, { method: "POST" })
                          await fetchPosts()
                        }}
                        className="rounded-lg bg-sky-50 px-3 py-1.5 font-medium text-sky-700 hover:bg-sky-100"
                      >
                        Like {p.likes ?? 0}
                      </button>
                      <button
                        onClick={() => loadComments(p.id)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-200"
                      >
                        Comments ({comments[p.id]?.length ?? 0})
                      </button>
                    </div>

                    {comments[p.id] ? (
                      <div className="mt-4 space-y-3 rounded-2xl bg-white p-3">
                        {comments[p.id].map((comment) => (
                          <div key={comment.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            <span className="font-semibold text-slate-900">{comment.author?.name ?? "User"}:</span> {comment.content}
                          </div>
                        ))}

                        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                          <input
                            value={commentDrafts[p.id] ?? ""}
                            onChange={(event) =>
                              setCommentDrafts((current) => ({
                                ...current,
                                [p.id]: event.target.value,
                              }))
                            }
                            placeholder="Write a comment"
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400"
                          />
                          <button
                            onClick={() => handleComment(p.id)}
                            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
              <h3 className="text-base font-semibold text-slate-900">Overview</h3>
              <div className="mt-4 space-y-3">
                {[
                  ["Posts", String(posts.length)],
                  ["Engagement", "High"],
                  ["Status", "Active"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xl shadow-slate-300/40">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Performance</p>
              <h3 className="mt-3 text-3xl font-bold">+28.4%</h3>
              <p className="mt-2 text-sm text-slate-300">Audience growth this month across your active communities.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}