"use client"

import { useEffect, useState } from "react"

type Comment = {
  id: string
  content: string
  createdAt: string
  user: { id: string; name: string | null; username: string | null; image: string | null }
  replies?: Comment[]
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState("")

  async function loadComments() {
    try {
      setLoading(true)
      const response = await fetch(`/api/v1/posts/${postId}/comments`)
      if (!response.ok) throw new Error("Failed to load comments")
      const body = await response.json()
      setComments(body.data?.items ?? body.items ?? [])
    } catch (loadError) {
      console.error(loadError)
      setError("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadComments() }, [postId])

  async function submitComment() {
    if (!content.trim()) return
    setPosting(true)
    setError("")
    try {
      const response = await fetch(`/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId: replyingTo }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message ?? body.error ?? "Failed to comment")
      setContent("")
      setReplyingTo(null)
      await loadComments()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to comment")
    } finally {
      setPosting(false)
    }
  }

  async function removeComment(id: string) {
    const response = await fetch(`/api/v1/comments/${id}`, { method: "DELETE" })
    if (response.ok) await loadComments()
  }

  function renderComment(comment: Comment, reply = false) {
    return (
      <div key={comment.id} className={reply ? "ml-10 mt-3" : "mt-5"}>
        <div className="flex gap-3">
          {comment.user.image
            ? <img src={comment.user.image} alt={comment.user.name ?? "User"} className="h-9 w-9 rounded-full object-cover" />
            : <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold dark:bg-gray-800">{(comment.user.name ?? "U").charAt(0).toUpperCase()}</div>}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.user.name ?? "User"}</span>
              {comment.user.username && <span className="text-xs text-gray-500">@{comment.user.username}</span>}
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              {!reply && <button onClick={() => setReplyingTo(comment.id)} className="hover:text-blue-500">Reply</button>}
              <button onClick={() => void removeComment(comment.id)} className="hover:text-red-500">Delete</button>
              <time>{new Date(comment.createdAt).toLocaleString()}</time>
            </div>
          </div>
        </div>
        {comment.replies?.map((item) => renderComment(item, true))}
      </div>
    )
  }

  return (
    <section className="border-t border-gray-200 p-4 dark:border-gray-800">
      <h2 className="text-lg font-bold">Comments</h2>
      {replyingTo && <div className="mt-3 flex justify-between rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-gray-900"><span>Replying to comment</span><button onClick={() => setReplyingTo(null)} className="font-semibold">Cancel</button></div>}
      <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={3} maxLength={2000} placeholder={replyingTo ? "Write your reply..." : "Write a comment..."} className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-gray-700" />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-2 flex justify-end"><button onClick={() => void submitComment()} disabled={posting || !content.trim()} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{posting ? "Posting..." : replyingTo ? "Reply" : "Comment"}</button></div>
      {loading ? <p className="mt-6 text-sm text-gray-500">Loading comments...</p> : comments.length === 0 ? <p className="mt-6 text-sm text-gray-500">No comments yet.</p> : <div className="mt-6">{comments.map((comment) => renderComment(comment))}</div>}
    </section>
  )
}
