import { queuePushNotification } from "@/lib/jobs/push.job"

export async function sendPushToUser(
  userId: string,
  notification: {
    title: string
    body: string
    data?: Record<string, string>
  }
) {
  return queuePushNotification({
    userId,
    title: notification.title,
    body: notification.body,
    data: notification.data,
  })
}
