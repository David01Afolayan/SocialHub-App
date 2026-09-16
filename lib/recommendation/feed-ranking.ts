type RankingPost = {
  id: string
  authorId: string
  likes: number
  comments: number
  reposts: number
  createdAt: Date
}

export function rankPost(post: RankingPost, affinity = 0, interestScore = 0) {
  const ageHours = Math.max(1, (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60))
  const engagement = post.likes + post.comments * 2 + post.reposts * 3
  const freshness = 1 / Math.pow(ageHours + 2, 1.2)
  return engagement * freshness + affinity * 10 + interestScore * 5
}
