import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { publishUserEvent } from "@/lib/realtime"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId: id,
      },
    })

    if (post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: "LIKE",
          message: `${session.user.name ?? "Someone"} liked your post`,
          postId: post.id,
        },
      })
      await publishUserEvent(post.authorId, "notification:new", {
        type: "LIKE",
        message: `${session.user.name ?? "Someone"} liked your post`,
        postId: post.id,
      })
    }

    return NextResponse.json({ liked: true })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}