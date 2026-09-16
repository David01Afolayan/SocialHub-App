import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { normalizeMediaUrls } from "@/lib/media"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams
  const query = searchParams.get("q")?.trim()
  const cursor = searchParams.get("cursor")
  const mine = searchParams.get("mine") === "1"
  const session = await auth()
  const userId = session?.user?.id
  if (mine && !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const posts = await prisma.post.findMany({
    where: {
      ...(mine
        ? { authorId: session?.user?.id }
        : {
            published: true,
            OR: [{ scheduledAt: null }, { scheduledAt: { lte: new Date() } }],
          }),
      ...(query
        ? { content: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      author: {
        include: {
          followers: userId
            ? {
                where: { followerId: userId },
                select: { id: true },
              }
            : false,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true,
        },
      },
      likes: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
    take: 20,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({
    posts: posts.map((post) => ({
      ...post,
      author: {
        ...post.author,
        followers: undefined,
      },
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      bookmarkCount: post._count.bookmarks,
      liked: userId ? post.likes.length > 0 : false,
      following: userId ? post.author.followers.length > 0 : false,
      status: post.published ? "PUBLISHED" : "SCHEDULED",
    })),
    nextCursor: posts.length === 20 ? posts[posts.length - 1].id : null,
  })
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
        published: !publishAt,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}