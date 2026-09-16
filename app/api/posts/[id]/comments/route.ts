import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const comments = await prisma.comment.findMany({
    where: { postId: id },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(comments)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const { content } = await req.json()
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Comment required" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: id,
        userId: session.user.id,
      },
      include: { user: true },
    })

    if (post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: "COMMENT",
          message: `${session.user.name ?? "Someone"} commented on your post`,
          postId: post.id,
        },
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}