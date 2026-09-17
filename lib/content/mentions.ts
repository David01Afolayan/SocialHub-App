export function extractMentions(content: string): string[] {
  const matches = content.match(/@[a-zA-Z0-9_]+/g) ?? []
  return [...new Set(matches.map((username) => username.slice(1).toLowerCase()))]
}
