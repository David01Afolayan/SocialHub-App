import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { publishUserEvent } from "@/lib/realtime"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: targetUserId } = await params
    const followerId = session.user.id

    if (followerId === targetUserId) {
      return NextResponse.json(
        { error: "You cannot follow yourself." },
        { status: 400 },
      )
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
      },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      })

      return NextResponse.json({ following: false })
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId: targetUserId,
      },
    })

    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "FOLLOW",
        message: `${session.user.name ?? "Someone"} started following you.`,
      },
    })
    await publishUserEvent(targetUserId, "notification:new", {
      type: "FOLLOW",
      message: `${session.user.name ?? "Someone"} started following you.`,
    })

    return NextResponse.json({ following: true })
  } catch (error) {
    console.error("FOLLOW_ERROR", error)
    return NextResponse.json(
      { error: "Something went wrong while updating the follow." },
      { status: 500 },
    )
  }
}
