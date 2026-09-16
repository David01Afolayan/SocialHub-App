export async function searchSocialHub(query: string, type = "ALL") {
  const params = new URLSearchParams({ q: query, type })
  const response = await fetch(`/api/v1/search?${params.toString()}`)
  if (!response.ok) throw new Error("Search request failed")
  return response.json()
}
