export function extractHashtags(content: string): string[] {
  const matches = content.match(/#[a-zA-Z0-9_]+/g) ?? []
  return [...new Set(matches.map((tag) => tag.slice(1).toLowerCase()))]
}
