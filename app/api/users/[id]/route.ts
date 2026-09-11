import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getDisplayName, getProfileHandle } from "@/lib/profile"
import { NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const currentUser = await auth()

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
        posts: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isFollowing = currentUser?.user?.id
      ? await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.user.id,
              followingId: id,
            },
          },
        })
      : null

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      displayName: getDisplayName(user),
      handle: getProfileHandle(user.username ?? user.name ?? "user"),
      bio: user.bio,
      image: user.image,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing: Boolean(isFollowing),
      posts: user.posts,
    })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
