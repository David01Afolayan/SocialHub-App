import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { prisma } from "@/lib/prisma"

type RouteContext = { params: Promise<{ id: string }> }

async function getGroup(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: { members: true },
  })
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth()
    const requesterId = session?.user?.id

    if (!requesterId) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const { id } = await params
    const body = await request.json()
    const userId = typeof body?.userId === "string" ? body.userId.trim() : ""

    if (!userId) {
      return failure("userId is required.", 400, "USER_ID_REQUIRED")
    }

    const conversation = await getGroup(id)
    if (!conversation) {
      return failure("Conversation not found.", 404, "CONVERSATION_NOT_FOUND")
    }
    if (!conversation.isGroup) {
      return failure("This is not a group conversation.", 400, "NOT_A_GROUP")
    }

    const requester = conversation.members.find((member) => member.userId === requesterId)
    if (requester?.role !== "ADMIN") {
      return failure("Only group admins can add members.", 403, "FORBIDDEN")
    }
    if (conversation.members.length >= 100) {
      return failure("Group cannot contain more than 100 users.", 400, "GROUP_TOO_LARGE")
    }
    if (conversation.members.some((member) => member.userId === userId)) {
      return failure("User is already a member.", 409, "ALREADY_MEMBER")
    }
    if (!(await prisma.user.findUnique({ where: { id: userId }, select: { id: true } }))) {
      return failure("User not found.", 404, "USER_NOT_FOUND")
    }

    const member = await prisma.conversationMember.create({
      data: { conversationId: id, userId, role: "MEMBER" },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    })

    return success(member, 201)
  } catch (error) {
    console.error("ADD_GROUP_MEMBER_ERROR", error)
    return failure("Failed to add member.", 500, "INTERNAL_ERROR")
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth()
    const requesterId = session?.user?.id

    if (!requesterId) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const { id } = await params
    const userId = new URL(request.url).searchParams.get("userId")
    if (!userId) {
      return failure("userId is required.", 400, "USER_ID_REQUIRED")
    }

    const conversation = await getGroup(id)
    if (!conversation) {
      return failure("Conversation not found.", 404, "CONVERSATION_NOT_FOUND")
    }
    if (!conversation.isGroup) {
      return failure("This is not a group conversation.", 400, "NOT_A_GROUP")
    }

    const requester = conversation.members.find((member) => member.userId === requesterId)
    if (requester?.role !== "ADMIN") {
      return failure("Only group admins can remove members.", 403, "FORBIDDEN")
    }

    const target = conversation.members.find((member) => member.userId === userId)
    if (!target) {
      return failure("Member not found.", 404, "MEMBER_NOT_FOUND")
    }
    if (target.role === "ADMIN" && userId !== requesterId) {
      return failure("Cannot remove another admin.", 400, "CANNOT_REMOVE_ADMIN")
    }
    if (
      target.role === "ADMIN" &&
      conversation.members.filter((member) => member.role === "ADMIN").length === 1
    ) {
      return failure("A group must retain an admin.", 400, "LAST_ADMIN")
    }

    await prisma.conversationMember.delete({ where: { id: target.id } })
    return success({ removed: userId })
  } catch (error) {
    console.error("REMOVE_GROUP_MEMBER_ERROR", error)
    return failure("Failed to remove member.", 500, "INTERNAL_ERROR")
  }
}
