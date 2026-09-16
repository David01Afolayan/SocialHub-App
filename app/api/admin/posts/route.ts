import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true, content: true, mediaUrl: true, published: true,
        scheduledAt: true, createdAt: true,
        author: { select: { id: true, name: true, username: true, email: true } },
        _count: { select: { likes: true, comments: true, bookmarks: true } },
      },
    })

    return NextResponse.json({
      posts: posts.map((post) => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        bookmarkCount: post._count.bookmarks,
        _count: undefined,
      })),
    })
  } catch (error) {
    console.error("ADMIN_POSTS_ERROR", error)
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 })
  }
}
