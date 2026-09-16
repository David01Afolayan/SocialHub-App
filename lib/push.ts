export type PushNotification = {
  token: string
  title: string
  body: string
  data?: Record<string, string>
}

export interface PushProvider {
  send(notification: PushNotification): Promise<void>
}
