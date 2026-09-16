export type ModerationDecision = "ALLOW" | "REVIEW" | "BLOCK"
export type ModerationTarget = "POST" | "COMMENT" | "PROFILE" | "MESSAGE"

export type ModerationResult = {
  decision: ModerationDecision
  score: number
  reasons: string[]
}
