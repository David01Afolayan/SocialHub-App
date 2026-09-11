import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notifications = await prisma.notification.findMany({
    where: { recipientId: session.user.id },
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(notifications)
}

export async function PATCH() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.notification.updateMany({
    where: { recipientId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
