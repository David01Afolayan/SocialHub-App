"use client"

import { useSession } from "next-auth/react"
import { FormEvent, useEffect, useState } from "react"
import BackButton from "@/components/back-button"

type ChatMode = "private" | "public"

type Message = {
  id: string
  authorId: string
  author: string
  initials: string
  text: string
  time: string
  own?: boolean
}

const conversations = {
  private: [
    { name: "Maya Chen", detail: "Launch planning", initials: "MC", status: "Online" },
    { name: "Creative team", detail: "4 members", initials: "CT", status: "3 new" },
    { name: "Jordan Lee", detail: "Campaign review", initials: "JL", status: "Yesterday" },
  ],
  public: [
    { name: "Community lounge", detail: "128 members", initials: "CL", status: "24 active" },
    { name: "Creator circle", detail: "76 members", initials: "CC", status: "8 new" },
    { name: "Announcements", detail: "Everyone", initials: "AN", status: "Today" },
  ],
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [mode, setMode] = useState<ChatMode>("private")
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!session?.user?.id) return

    const loadMessages = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/chat?mode=${mode}`)
        if (!response.ok) throw new Error("Unable to load messages")
        const data = await response.json()
        setMessages(data.map((message: { id: string; authorId: string; content: string; createdAt: string; author: { name?: string | null } }) => ({
          id: message.id,
          authorId: message.authorId,
          author: message.author.name ?? "Community member",
          initials: (message.author.name ?? "CM").slice(0, 2).toUpperCase(),
          text: message.content,
          time: new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          own: message.authorId === session.user.id,
        })))
      } catch {
        setError("Could not load messages.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadMessages()
  }, [mode, session?.user?.id])

  if (status === "loading") return <main className="p-8">Loading chat...</main>
  if (!session) return <main className="p-8">Sign in to access chat.</main>

  const activeConversation = conversations[mode][0]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setError("")
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, mode }),
    })
    if (!response.ok) {
      setError("Could not send your message.")
      return
    }

    const message = await response.json()
    setMessages((current) => [...current, {
      id: message.id,
      authorId: message.authorId,
      author: "You",
      initials: "YU",
      text: message.content,
      time: new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      own: true,
    }])
    setDraft("")
  }

  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-6 text-slate-900 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4">
              <BackButton />
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-600">Conversations</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Chat with your community</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">Keep focused team conversations private or open the floor to everyone.</p>
          </div>

          <div className="inline-flex w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist" aria-label="Chat type">
            {(["private", "public"] as ChatMode[]).map((chatMode) => (
              <button
                key={chatMode}
                type="button"
                role="tab"
                aria-selected={mode === chatMode}
                onClick={() => {
                  setMode(chatMode)
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${mode === chatMode ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                {chatMode} chat
              </button>
            ))}
          </div>
        </div>

        <section className="grid min-h-155 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[280px_1fr]">
          <aside className="border-b border-slate-200 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <h2 className="font-semibold text-slate-950">{mode === "private" ? "Direct messages" : "Public spaces"}</h2>
                <p className="mt-1 text-xs text-slate-500">{conversations[mode].length} conversations</p>
              </div>
              <button type="button" aria-label="Start a new conversation" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-500 hover:border-sky-300 hover:text-sky-600">+</button>
            </div>

            <div className="space-y-1">
              {conversations[mode].map((conversation, index) => (
                <button key={conversation.name} type="button" className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${index === 0 ? "bg-white shadow-sm ring-1 ring-slate-200" : "hover:bg-white/80"}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${index === 0 ? "bg-sky-100 text-sky-700" : "bg-slate-200 text-slate-600"}`}>{conversation.initials}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">{conversation.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">{conversation.detail}</span>
                  </span>
                  <span className={`text-[10px] font-semibold ${index === 0 ? "text-emerald-600" : "text-slate-400"}`}>{conversation.status}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="flex min-h-155 flex-col">
            <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 md:px-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sm font-bold text-sky-700">{activeConversation.initials}</span>
                <div>
                  <h2 className="font-semibold text-slate-950">{activeConversation.name}</h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{activeConversation.detail}</p>
                </div>
              </div>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">{mode === "private" ? "Private" : "Open to everyone"}</span>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_35%)] px-5 py-6 md:px-7">
              <div className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Today</div>
              {isLoading ? <p className="text-center text-sm text-slate-400">Loading messages...</p> : null}
              {!isLoading && !messages.length ? <p className="text-center text-sm text-slate-400">No messages yet. Start the conversation.</p> : null}
              {messages.map((message) => (
                <div key={message.id} className={`flex items-end gap-3 ${message.own ? "justify-end" : ""}`}>
                  {!message.own ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[10px] font-bold text-slate-600">{message.initials}</span> : null}
                  <div className={`max-w-[80%] md:max-w-[65%] ${message.own ? "items-end" : "items-start"}`}>
                    <div className={`mb-1 flex items-center gap-2 text-[11px] text-slate-400 ${message.own ? "justify-end" : ""}`}><span>{message.author}</span><span>{message.time}</span></div>
                    <p className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.own ? "rounded-br-md bg-sky-600 text-white shadow-md shadow-sky-600/15" : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"}`}>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4 md:p-5">
              {error ? <p className="mb-2 px-2 text-xs text-rose-600">{error}</p> : null}
              <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
                <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={mode === "private" ? "Message your team..." : "Share with the community..."} rows={2} className="min-h-12 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600">Send</button>
              </div>
              <p className="mt-2 px-2 text-[11px] text-slate-400">{mode === "private" ? "Only members of this conversation can see your messages." : "Your message will be visible to everyone in this space."}</p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}