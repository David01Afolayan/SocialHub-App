type RuleMatch = { category: string; score: number; reason: string }

const rules: Array<{ category: string; pattern: RegExp; score: number; reason: string }> = [
  { category: "SPAM", pattern: /\b(click here|buy now|limited offer)\b/i, score: 25, reason: "Promotional spam pattern detected" },
  { category: "SCAM", pattern: /\b(send money|guaranteed profit|double your money)\b/i, score: 45, reason: "Potential scam pattern detected" },
]

export function runModerationRules(content: string): RuleMatch[] {
  return rules.filter((rule) => rule.pattern.test(content)).map(({ category, score, reason }) => ({ category, score, reason }))
}
