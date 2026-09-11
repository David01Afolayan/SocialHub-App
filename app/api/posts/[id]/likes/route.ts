import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

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

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })

    if (post.authorId !== session.user.id) {
      const actor = await prisma.user.findUnique({ where: { id: session.user.id } })
      const message = `${actor?.name ?? "Someone"} liked your post`

      await prisma.notification.create({
        data: {
          type: "like",
          message,
          recipientId: post.authorId,
          actorId: session.user.id,
          postId: post.id,
        },
      })
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}