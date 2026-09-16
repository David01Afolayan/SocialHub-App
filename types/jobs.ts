export type PushNotificationJob = {
  userId: string
  title: string
  body: string
  notificationId?: string
  data?: Record<string, string>
}

export type EmailJob = {
  userId: string
  email: string
  subject: string
  template: string
  data?: Record<string, unknown>
}

export type MediaJob = {
  mediaId: string
  userId: string
  action: "PROCESS" | "THUMBNAIL" | "OPTIMIZE"
}
