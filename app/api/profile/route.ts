import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getProfileHandle } from "@/lib/profile"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      handle: getProfileHandle(user.username ?? user.name ?? "user"),
      bio: user.bio,
      email: user.email,
      image: user.image,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username, bio } = await req.json()
    const nextUsername = typeof username === "string" ? username.trim() : ""
    const nextBio = typeof bio === "string" ? bio.trim().slice(0, 200) : ""

    if (nextUsername && !/^[a-zA-Z0-9_-]+$/.test(nextUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, and dashes" },
        { status: 400 },
      )
    }

    const normalizedUsername = nextUsername.toLowerCase().replace(/\s+/g, "-")

    if (normalizedUsername) {
      const existing = await prisma.user.findUnique({ where: { username: normalizedUsername } })
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: normalizedUsername || null,
        bio: nextBio || null,
      },
      include: { followers: { select: { followerId: true } }, following: { select: { followingId: true } } },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      handle: getProfileHandle(user.username ?? user.name ?? "user"),
      bio: user.bio,
      email: user.email,
      image: user.image,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
