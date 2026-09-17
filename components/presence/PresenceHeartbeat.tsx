"use client"

import { useEffect } from "react"

export default function PresenceHeartbeat() {
  useEffect(() => {
    const heartbeat = () => {
      void fetch("/api/v1/presence/heartbeat", { method: "POST" }).catch(() => undefined)
    }
    heartbeat()
    const interval = window.setInterval(heartbeat, 30000)
    return () => window.clearInterval(interval)
  }, [])
  return null
}
