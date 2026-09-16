import { getCache, setCache } from "@/lib/cache"

export function searchCacheKey(query: string) {
  return `search:suggestions:${query.trim().toLowerCase()}`
}

export function getCachedSuggestions<T>(query: string) {
  return getCache<T>(searchCacheKey(query))
}

export function cacheSuggestions<T>(query: string, value: T) {
  return setCache(searchCacheKey(query), value, 60)
}
