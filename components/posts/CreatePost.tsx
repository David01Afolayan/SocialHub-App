"use client"

import { FormEvent, useState } from "react"

export default function CreatePost({ onCreated }: { onCreated?: (post: unknown) => void }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError("")
    if (!content.trim()) {
      setError("Write something first.")
      return
    }
    setLoading(true)
    try {
      const response = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), mediaUrls: [], visibility: "PUBLIC" }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message ?? data.error ?? "Failed to create post")
      setContent("")
      onCreated?.(data.data ?? data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="border-b border-gray-200 p-4 dark:border-gray-800">
      <textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} rows={4} placeholder="What's happening?" className="w-full resize-none rounded-xl border border-gray-200 bg-transparent p-3 outline-none focus:border-blue-500 dark:border-gray-700" />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{content.length}/5000</span>
        <button type="submit" disabled={loading || !content.trim()} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  )
}
