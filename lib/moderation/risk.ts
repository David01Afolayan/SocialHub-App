import { MODERATION_THRESHOLDS } from "@/lib/moderation/thresholds"
import { runModerationRules } from "@/lib/moderation/rules"

export function calculateModerationRisk(content: string) {
  const matches = runModerationRules(content)
  const score = Math.min(100, matches.reduce((total, match) => total + match.score, 0))
  const decision = score >= MODERATION_THRESHOLDS.BLOCK
    ? "BLOCK"
    : score >= MODERATION_THRESHOLDS.REVIEW ? "REVIEW" : "ALLOW"
  return { decision: decision as "ALLOW" | "REVIEW" | "BLOCK", score, reasons: matches.map((match) => match.reason) }
}
