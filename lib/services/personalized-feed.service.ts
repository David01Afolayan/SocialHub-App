import { prisma } from "@/lib/prisma"
import { rankPost } from "@/lib/recommendation/feed-ranking"
import { getSeenPosts } from "@/lib/recommendation/seen-posts"

export async function getPersonalizedFeed(userId: string) {
  const seen = new Set(await getSeenPosts(userId))
  const [posts, interests, follows] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, moderationStatus: "APPROVED", visibility: "PUBLIC" },
      include: { author: true, _count: { select: { likes: true, comments: true, reposts: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.userInterest.findMany({ where: { userId }, select: { topic: true, score: true } }),
    prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } }),
  ])
  const following = new Set(follows.map((follow) => follow.followingId))
  const interestScore = new Map(interests.map((interest) => [interest.topic.toLowerCase(), interest.score]))
  return posts
    .filter((post) => !seen.has(post.id))
    .map((post) => ({
      post,
      score: rankPost(
        {
          id: post.id,
          authorId: post.authorId,
          likes: post._count.likes,
          comments: post._count.comments,
          reposts: post._count.reposts,
          createdAt: post.createdAt,
        },
        following.has(post.authorId) ? 1 : 0,
        interestScore.get(post.content?.toLowerCase() ?? "") ?? 0,
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}
