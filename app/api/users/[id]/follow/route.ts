import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.id === id) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const follow = await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: id,
        },
      },
      update: {},
      create: {
        followerId: session.user.id,
        followingId: id,
      },
    })

    const actor = await prisma.user.findUnique({ where: { id: session.user.id } })
    await prisma.notification.create({
      data: {
        type: "follow",
        message: `${actor?.name ?? "Someone"} followed you`,
        recipientId: id,
        actorId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, followId: follow.id, following: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: session.user.id,
        followingId: id,
      },
    })

    return NextResponse.json({ success: true, following: false })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
