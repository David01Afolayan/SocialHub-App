import { prisma } from "@/lib/prisma"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { normalizeMediaUrls } from "@/lib/media"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const query = searchParams.get("q")?.trim()
  const mine = searchParams.get("mine") === "1"
  const session = mine ? await auth() : null
  if (mine && !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const posts = await prisma.post.findMany({
    where: {
      ...(mine
        ? { authorId: session?.user?.id }
        : {
            status: "PUBLISHED",
            OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }],
          }),
      ...(query
        ? { content: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const content = typeof body.content === "string" ? body.content.trim() : ""
    const mediaUrls = normalizeMediaUrls(body.mediaUrls)
    if (!content && mediaUrls.length === 0) {
      return NextResponse.json({ error: "Content or media required" }, { status: 400 })
    }

    let publishAt: Date | null = null
    if (body.scheduledAt) {
      publishAt = new Date(body.scheduledAt)
      if (Number.isNaN(publishAt.getTime()) || publishAt <= new Date()) {
        return NextResponse.json(
          { error: "Scheduled time must be a valid future date" },
          { status: 400 },
        )
      }
    }

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrls,
        authorId: session.user.id,
        scheduledAt: publishAt,
        status: publishAt ? "SCHEDULED" : "PUBLISHED",
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}