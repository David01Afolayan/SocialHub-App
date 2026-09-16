import type { NotificationItem } from "@/types/notification"

export function groupNotifications(notifications: NotificationItem[]) {
  const groups = new Map<string, NotificationItem[]>()
  for (const notification of notifications) {
    const key = `${notification.type}:${notification.postId ?? notification.id}`
    groups.set(key, [...(groups.get(key) ?? []), notification])
  }
  return Array.from(groups, ([key, items]) => ({ key, items }))
}
