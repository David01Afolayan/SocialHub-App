export const notificationPreferenceKeys = [
  "likes",
  "comments",
  "follows",
  "mentions",
  "messages",
  "reposts",
  "pushEnabled",
  "emailEnabled",
] as const

export function parseNotificationPreferences(value: unknown) {
  if (!value || typeof value !== "object") return null
  const input = value as Record<string, unknown>
  const result: Record<string, boolean> = {}

  for (const key of notificationPreferenceKeys) {
    if (key in input) {
      if (typeof input[key] !== "boolean") return null
      result[key] = input[key]
    }
  }

  return result
}
