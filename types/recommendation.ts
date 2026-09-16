export type FeedSignal = {
  userId: string
  postId: string
  signal: "LIKE" | "COMMENT" | "REPOST" | "BOOKMARK" | "VIEW" | "FOLLOW" | "HIDE"
  weight: number
}
