import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true, name: true, email: true, username: true, image: true,
        role: true, createdAt: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
    })

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        postCount: user._count.posts,
        followerCount: user._count.followers,
        followingCount: user._count.following,
        _count: undefined,
      })),
    })
  } catch (error) {
    console.error("ADMIN_USERS_ERROR", error)
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 })
  }
}
