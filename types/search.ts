export type SearchType = "ALL" | "USERS" | "POSTS" | "HASHTAGS"

export type SearchResultUser = {
  id: string
  name: string | null
  username: string | null
  image: string | null
}

export type SearchResultPost = {
  id: string
  content: string | null
  createdAt: string | Date
  author: SearchResultUser
}

export type SearchResultHashtag = {
  id: string
  name: string
}
