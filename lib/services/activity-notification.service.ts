import { createNotification } from "@/lib/services/notification.service"

export async function notifyUser(
  userId: string,
  actorId: string,
  data: { type: string; title: string; message?: string; entityId?: string; entityType?: string },
) {
  if (userId === actorId) return null
  return createNotification({
    userId,
    actorId,
    type: data.type,
    title: data.title,
    message: data.message ?? "",
  })
}
