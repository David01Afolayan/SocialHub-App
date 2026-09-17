import { NextRequest } from "next/server"
import { requireApiUser } from "@/lib/api-auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    const [posts, likes, comments, followers] = await Promise.all([
      prisma.post.count({ where: { authorId: user.id } }),
      prisma.like.count({ where: { post: { authorId: user.id } } }),
      prisma.comment.count({ where: { post: { authorId: user.id } } }),
      prisma.follow.count({ where: { followingId: user.id } }),
    ])
    return success({ posts, likes, comments, followers })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }
    console.error("ANALYTICS_GET_ERROR", error)
    return failure("Unable to load analytics.", 500)
  }
}
