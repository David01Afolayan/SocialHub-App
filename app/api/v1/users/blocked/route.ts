import { NextRequest } from "next/server"
import { requireApiUser } from "@/lib/api-auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    const blocks = await prisma.userBlock.findMany({
      where: { blockerId: user.id },
      include: { blocked: { select: { id: true, name: true, username: true, image: true } } },
      orderBy: { createdAt: "desc" },
    })
    return success(blocks)
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return failure("Authentication required.", 401, "UNAUTHORIZED")
    console.error("BLOCKED_USERS_ERROR", error)
    return failure("Unable to load blocked users.", 500)
  }
}
