export function calculateSearchScore(value: string, query: string) {
  const text = value.toLowerCase()
  const q = query.toLowerCase()
  if (text === q) return 100
  if (text.startsWith(q)) return 75
  if (text.includes(q)) return 50
  return 0
}
