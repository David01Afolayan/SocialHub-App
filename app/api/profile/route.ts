import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getProfileHandle } from "@/lib/profile"
import { NextResponse } from "next/server"

const MAX_NAME_LENGTH = 80
const MAX_USERNAME_LENGTH = 30
const MAX_BIO_LENGTH = 280

function formatProfile(user: {
  id: string
  name: string | null
  username: string | null
  bio: string | null
  image: string | null
  email: string | null
  followers?: { followerId: string }[]
  following?: { followingId: string }[]
}) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    handle: getProfileHandle(user.username ?? user.name ?? "user"),
    bio: user.bio,
    image: user.image,
    email: user.email,
    ...(user.followers ? { followersCount: user.followers.length } : {}),
    ...(user.following ? { followingCount: user.following.length } : {}),
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        email: true,
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(formatProfile(user))
  } catch (error) {
    console.error("GET_PROFILE_ERROR", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const username =
      typeof body.username === "string" ? body.username.trim().toLowerCase() : ""
    const bio = typeof body.bio === "string" ? body.bio.trim() : ""
    const image = typeof body.image === "string" ? body.image.trim() : ""

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 })
    }
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name cannot exceed ${MAX_NAME_LENGTH} characters.` },
        { status: 400 },
      )
    }
    if (!username) {
      return NextResponse.json({ error: "Username is required." }, { status: 400 })
    }
    if (username.length > MAX_USERNAME_LENGTH) {
      return NextResponse.json(
        { error: `Username cannot exceed ${MAX_USERNAME_LENGTH} characters.` },
        { status: 400 },
      )
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers and underscores." },
        { status: 400 },
      )
    }
    if (bio.length > MAX_BIO_LENGTH) {
      return NextResponse.json(
        { error: `Bio cannot exceed ${MAX_BIO_LENGTH} characters.` },
        { status: 400 },
      )
    }

    if (image) {
      try {
        const imageUrl = new URL(image)
        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          throw new Error("Invalid protocol")
        }
      } catch {
        return NextResponse.json(
          { error: "Profile image must be a valid URL." },
          { status: 400 },
        )
      }
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: session.user.id },
      },
      select: { id: true },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 },
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        bio: bio || null,
        image: image || null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        email: true,
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
      },
    })

    return NextResponse.json(formatProfile(updatedUser))
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error)
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 })
  }
}
