import { NextRequest } from "next/server"
import { requireApiUser } from "@/lib/api-auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

type Context = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const user = await requireApiUser(request)
    const { id } = await params
    if (id === user.id) return failure("You cannot block yourself.", 400, "INVALID_TARGET")
    const target = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!target) return failure("User not found.", 404, "USER_NOT_FOUND")
    await prisma.userBlock.upsert({
      where: { blockerId_blockedId: { blockerId: user.id, blockedId: id } },
      update: {},
      create: { blockerId: user.id, blockedId: id },
    })
    return success({ blocked: true })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return failure("Authentication required.", 401, "UNAUTHORIZED")
    console.error("BLOCK_USER_ERROR", error)
    return failure("Unable to block user.", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const user = await requireApiUser(request)
    const { id } = await params
    await prisma.userBlock.deleteMany({ where: { blockerId: user.id, blockedId: id } })
    return success({ blocked: false })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return failure("Authentication required.", 401, "UNAUTHORIZED")
    console.error("UNBLOCK_USER_ERROR", error)
    return failure("Unable to unblock user.", 500)
  }
}
