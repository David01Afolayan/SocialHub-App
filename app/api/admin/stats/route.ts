import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const [users, posts, comments, likes, bookmarks, follows, messages, admins] =
      await Promise.all([
        prisma.user.count(),
        prisma.post.count(),
        prisma.comment.count(),
        prisma.like.count(),
        prisma.bookmark.count(),
        prisma.follow.count(),
        prisma.chatMessage.count(),
        prisma.user.count({ where: { role: "ADMIN" } }),
      ])

    return NextResponse.json({ users, posts, comments, likes, bookmarks, follows, messages, admins })
  } catch (error) {
    console.error("ADMIN_STATS_ERROR", error)
    return NextResponse.json({ error: "Failed to load admin statistics" }, { status: 500 })
  }
}
