"use client"

import { useEffect, useState } from "react"
import { getPusherClient } from "@/lib/pusher-client"
import type { NotificationItem } from "@/types/notification"

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    if (!userId) return
    const pusher = getPusherClient()
    const channelName = `private-user-${userId}`
    const channel = pusher.subscribe(channelName)
    const handleNotification = (notification: NotificationItem) => {
      setNotifications((current) => current.some((item) => item.id === notification.id)
        ? current
        : [notification, ...current])
    }
    channel.bind("notification:new", handleNotification)
    return () => {
      channel.unbind("notification:new", handleNotification)
      pusher.unsubscribe(channelName)
    }
  }, [userId])

  return { notifications, setNotifications }
}
