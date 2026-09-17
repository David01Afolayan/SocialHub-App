"use client"

import { type FormEvent, useState } from "react"

export default function MessageComposer({
  conversationId,
  replyToId,
  onSent,
}: { conversationId: string; replyToId?: string | null; onSent?: () => void }) {
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)

  async function sendMessage(event: FormEvent) {
    event.preventDefault()
    const text = content.trim()
    if (!text || sending) return
    setSending(true)
    try {
      const response = await fetch(`/api/v1/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, type: "TEXT", replyToId }),
      })
      if (!response.ok) throw new Error("Failed to send message")
      setContent("")
      onSent?.()
    } catch (error) {
      console.error("SEND_MESSAGE_CLIENT_ERROR", error)
    } finally {
      setSending(false)
    }
  }

  function updateContent(value: string) {
    setContent(value)
    void fetch(`/api/v1/conversations/${conversationId}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isTyping: value.length > 0 }),
    }).catch(() => undefined)
  }

  return (
    <form onSubmit={(event) => void sendMessage(event)} className="flex gap-2 border-t p-3">
      <input value={content} onChange={(event) => updateContent(event.target.value)} placeholder="Write a message..." className="flex-1 rounded-lg border px-4 py-2 outline-none" disabled={sending} />
      <button type="submit" disabled={sending || !content.trim()} className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50">{sending ? "Sending..." : "Send"}</button>
    </form>
  )
}
