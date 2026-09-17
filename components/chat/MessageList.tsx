"use client"

import { useEffect, useState } from "react"
import type { ChatMessage } from "@/types/conversation"
import { subscribeToConversation, unsubscribeFromConversation } from "@/lib/conversation-channel"

export default function MessageList({
  conversationId,
  currentUserId,
}: { conversationId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUser, setTypingUser] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch(`/api/v1/conversations/${conversationId}/messages`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load messages")
        const body = await response.json()
        return body.data ?? body
      })
      .then((data) => {
        if (mounted) setMessages(data.messages ?? [])
      })
      .catch((error) => console.error("LOAD_MESSAGES_CLIENT_ERROR", error))

    let channel: ReturnType<typeof subscribeToConversation> | undefined
    try {
      channel = subscribeToConversation(conversationId)
      channel.bind("message:new", (message: ChatMessage) => {
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message])
      })
      channel.bind("typing", (data: { userId: string; isTyping: boolean }) => {
        if (data.userId !== currentUserId) setTypingUser(data.isTyping ? data.userId : null)
      })
    } catch (error) {
      console.error("SUBSCRIBE_CONVERSATION_ERROR", error)
    }

    return () => {
      mounted = false
      if (channel) {
        channel.unbind("message:new")
        channel.unbind("typing")
        unsubscribeFromConversation(conversationId)
      }
    }
  }, [conversationId, currentUserId])

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((message) => {
        const own = message.senderId === currentUserId
        return (
          <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${own ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
              {!own && <p className="mb-1 text-xs font-semibold">{message.sender.name ?? message.sender.username ?? "User"}</p>}
              {message.replyTo && <div className="mb-2 rounded border-l-2 border-current p-2 text-xs opacity-70">{message.replyTo.content}</div>}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="mt-1 text-[10px] opacity-60">{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{own && message.readAt && " • Read"}</div>
              <div className="mt-2 flex gap-1">
                {["LIKE", "LOVE", "LAUGH", "FIRE"].map((reaction) => (
                  <button key={reaction} onClick={() => void fetch(`/api/v1/messages/${message.id}/reactions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: reaction }) })} className="rounded px-1 text-xs hover:bg-black/10">
                    {reaction === "LIKE" ? "👍" : reaction === "LOVE" ? "❤️" : reaction === "LAUGH" ? "😂" : "🔥"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      })}
      {typingUser && <div className="text-sm text-gray-500">Someone is typing...</div>}
    </div>
  )
}
