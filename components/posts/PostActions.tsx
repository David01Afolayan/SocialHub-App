"use client"

import { useState } from "react"

type PostActionsProps = {
  postId: string
  liked: boolean
  bookmarked: boolean
  likeCount: number
  repostCount: number
  commentCount: number
  isOwner?: boolean
  onDeleted?: () => void
}

function responseData<T>(body: { data?: T } & T): T {
  return body.data ?? body
}

export default function PostActions({
  postId,
  liked,
  bookmarked,
  likeCount,
  repostCount,
  commentCount,
  isOwner = false,
  onDeleted,
}: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(liked)
  const [isBookmarked, setIsBookmarked] = useState(bookmarked)
  const [likes, setLikes] = useState(likeCount)
  const [reposts, setReposts] = useState(repostCount)
  const [busy, setBusy] = useState(false)

  async function toggleLike() {
    if (busy) return
    setBusy(true)
    try {
      const response = await fetch(`/api/v1/posts/${postId}/like`, { method: "POST" })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message ?? body.error ?? "Failed to like post")
      const next = responseData<{ liked: boolean }>(body).liked
      setIsLiked(next)
      setLikes((current) => next ? current + 1 : Math.max(0, current - 1))
    } catch (error) {
      console.error(error)
    } finally {
      setBusy(false)
    }
  }

  async function toggleBookmark() {
    try {
      const response = await fetch(`/api/v1/posts/${postId}/bookmark`, { method: "POST" })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message ?? body.error ?? "Failed to bookmark")
      setIsBookmarked(responseData<{ bookmarked: boolean }>(body).bookmarked)
    } catch (error) {
      console.error(error)
    }
  }

  async function repost() {
    try {
      const response = await fetch(`/api/v1/posts/${postId}/repost`, { method: "POST" })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error?.message ?? body.error ?? "Failed to repost")
      if (responseData<{ reposted: boolean }>(body).reposted) setReposts((current) => current + 1)
    } catch (error) {
      console.error(error)
    }
  }

  async function sharePost() {
    const url = `${window.location.origin}/post/${postId}`
    try {
      if (navigator.share) await navigator.share({ title: "SocialHub post", url })
      else {
        await navigator.clipboard.writeText(url)
        window.alert("Post link copied!")
      }
    } catch {
      // Sharing can be cancelled by the user.
    }
  }

  async function deletePost() {
    if (!window.confirm("Delete this post?")) return
    const response = await fetch(`/api/v1/posts/${postId}`, { method: "DELETE" })
    if (response.ok) onDeleted?.()
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
      <button onClick={() => void toggleLike()} disabled={busy} className={isLiked ? "font-semibold text-red-500" : "text-gray-500 hover:text-red-500"}>{isLiked ? "♥" : "♡"} {likes}</button>
      <span className="text-gray-500">💬 {commentCount}</span>
      <button onClick={() => void repost()} className="text-gray-500 hover:text-green-500">↻ {reposts}</button>
      <button onClick={() => void toggleBookmark()} className={isBookmarked ? "font-semibold text-yellow-500" : "text-gray-500 hover:text-yellow-500"}>{isBookmarked ? "★" : "☆"}</button>
      <button onClick={() => void sharePost()} className="text-gray-500 hover:text-blue-500">↗ Share</button>
      {isOwner && <button onClick={() => void deletePost()} className="text-gray-500 hover:text-red-500">🗑 Delete</button>}
    </div>
  )
}
