import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/repositories/notification-preference.repository"
import { parseNotificationPreferences } from "@/lib/validations/notification"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return failure("Authentication required.", 401, "UNAUTHORIZED")
  }

  return success(await getNotificationPreferences(session.user.id))
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return failure("Authentication required.", 401, "UNAUTHORIZED")
  }

  const preferences = parseNotificationPreferences(await request.json())
  if (!preferences) {
    return failure("Invalid notification preferences.", 400, "INVALID_PREFERENCES")
  }

  return success(await updateNotificationPreferences(
    session.user.id,
    preferences
  ))
}
