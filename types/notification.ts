export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "MENTION"
  | "MESSAGE"
  | "REPOST"
  | "SYSTEM"

export type NotificationActor = {
  id: string
  name: string | null
  username: string | null
  image: string | null
}

export type NotificationItem = {
  id: string
  type: NotificationType | string
  title: string
  message: string
  read: boolean
  createdAt: string
  actor?: NotificationActor | null
  postId?: string | null
}
