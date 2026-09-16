import { prisma } from "@/lib/prisma"
import { publishUserEvent } from "@/lib/realtime"
import { sendPushToUser } from "@/lib/services/push.service"
import { invalidateUnreadCount } from "@/lib/cache/notification-cache"

type CreateNotificationInput = {
  userId: string
  type: string
  title: string
  message: string
  postId?: string
  actorId?: string
}

function isNotificationEnabled(
  type: string,
  preferences: {
    likes: boolean
    comments: boolean
    follows: boolean
    mentions: boolean
    messages: boolean
    reposts: boolean
  }
) {
  const key = {
    LIKE: "likes",
    COMMENT: "comments",
    FOLLOW: "follows",
    MENTION: "mentions",
    MESSAGE: "messages",
    REPOST: "reposts",
  }[type] as keyof typeof preferences | undefined

  return key ? preferences[key] : true
}

export async function createNotification(data: CreateNotificationInput) {
  const preferences = await prisma.notificationPreference.upsert({
    where: { userId: data.userId },
    create: { userId: data.userId },
    update: {},
  })

  if (!isNotificationEnabled(data.type, preferences)) {
    return null
  }

  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      postId: data.postId,
      actorId: data.actorId,
    },
  })

  await publishUserEvent(data.userId, "notification:new", notification)
  await invalidateUnreadCount(data.userId)

  if (preferences.pushEnabled) {
    await sendPushToUser(data.userId, {
      title: data.title,
      body: data.message,
      data: { notificationId: notification.id, type: data.type },
    })
  }

  return notification
}
