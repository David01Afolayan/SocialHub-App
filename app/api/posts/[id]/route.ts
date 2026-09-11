import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await auth()
    const { id } = await params
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { content } = await req.json()
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content required" }, { status: 400 })
    }

    const post = await prisma.post.update({
      where: { id },
      data: { content: content.trim() },
    })

    return NextResponse.json(post)
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

    const existingPost = await prisma.post.findUnique({ where: { id } })
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}