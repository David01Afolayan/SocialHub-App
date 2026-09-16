"use client"

import { useEffect, useState } from "react"

type Notification = {
  id: string
  type: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notifications")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="eyebrow">Your activity</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Notifications</h1>
      </div>
      {loading ? <div className="animate-pulse rounded-2xl bg-slate-200 p-10" /> : notifications.length === 0 ? (
        <div className="workspace-surface rounded-2xl p-10 text-center">
          <h2 className="font-semibold text-slate-900">You&apos;re all caught up</h2>
          <p className="mt-1 text-sm text-slate-500">New follows, likes, and comments will appear here.</p>
        </div>
      ) : (
        <div className="workspace-surface divide-y divide-slate-100 rounded-2xl">
          {notifications.map((notification) => (
            <article key={notification.id} className="p-5">
              <p className="text-sm text-slate-700">{notification.message}</p>
              <time className="mt-2 block text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</time>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
