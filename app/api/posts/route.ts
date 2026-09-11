import { prisma } from "@/lib/prisma"
import { auth } from "@/app/api/auth/[...nextauth]/route"
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

    const { content, scheduledAt } = await req.json()
    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 })
    }

    let publishAt: Date | null = null
    if (scheduledAt) {
      publishAt = new Date(scheduledAt)
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