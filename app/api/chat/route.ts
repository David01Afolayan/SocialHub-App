import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const modes = ["private", "public"] as const

function isChatMode(value: string | null): value is (typeof modes)[number] {
  return value === "private" || value === "public"
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const mode = new URL(request.url).searchParams.get("mode")
  if (!isChatMode(mode)) {
    return NextResponse.json({ error: "A valid chat mode is required" }, { status: 400 })
  }

  const messages = await prisma.chatMessage.findMany({
    where: mode === "private" ? { mode, authorId: session.user.id } : { mode },
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  })

  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const content = typeof body.content === "string" ? body.content.trim() : ""
  const mode = body.mode
  if (!content || content.length > 2000 || !isChatMode(mode)) {
    return NextResponse.json({ error: "Valid content and chat mode are required" }, { status: 400 })
  }

  const message = await prisma.chatMessage.create({
    data: { content, mode, authorId: session.user.id },
    include: { author: { select: { id: true, name: true, image: true } } },
  })

  return NextResponse.json(message, { status: 201 })
}