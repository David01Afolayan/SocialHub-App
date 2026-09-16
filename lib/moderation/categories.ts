export const MODERATION_CATEGORIES = [
  "SPAM", "HARASSMENT", "HATE_SPEECH", "VIOLENCE",
  "SEXUAL_CONTENT", "SCAM", "IMPERSONATION", "COPYRIGHT", "OTHER",
] as const

export type ModerationCategory = typeof MODERATION_CATEGORIES[number]
