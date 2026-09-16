import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id }, select: { id: true } })
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 })

    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ADMIN_POST_DELETE_ERROR", error)
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 })
  }
}
