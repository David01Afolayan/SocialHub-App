import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { failure, success } from "@/lib/api/response"
import { createGroup } from "@/lib/services/conversation.service"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const creatorId = session?.user?.id

    if (!creatorId) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const body = await request.json()
    const name = body?.name
    const userIds = body?.userIds

    if (typeof name !== "string") {
      return failure("Group name is required.", 400, "GROUP_NAME_REQUIRED")
    }

    if (
      !Array.isArray(userIds) ||
      !userIds.every((userId): userId is string => typeof userId === "string")
    ) {
      return failure("userIds must be an array of strings.", 400, "INVALID_USER_IDS")
    }

    const uniqueUserIds = [...new Set([creatorId, ...userIds])]
    const userCount = await prisma.user.count({
      where: { id: { in: uniqueUserIds } },
    })

    if (userCount !== uniqueUserIds.length) {
      return failure("One or more users were not found.", 404, "USER_NOT_FOUND")
    }

    const conversation = await createGroup(creatorId, name, userIds)
    return success(conversation, 201)
  } catch (error) {
    const messages: Record<string, [string, number, string]> = {
      GROUP_NAME_REQUIRED: ["Group name is required.", 400, "GROUP_NAME_REQUIRED"],
      GROUP_NAME_TOO_LONG: ["Group name cannot exceed 100 characters.", 400, "GROUP_NAME_TOO_LONG"],
      GROUP_REQUIRES_THREE_USERS: ["A group requires at least 3 users.", 400, "GROUP_REQUIRES_THREE_USERS"],
      GROUP_TOO_LARGE: ["Group cannot contain more than 100 users.", 400, "GROUP_TOO_LARGE"],
    }

    if (error instanceof Error && messages[error.message]) {
      const [message, status, code] = messages[error.message]
      return failure(message, status, code)
    }

    console.error("CREATE_GROUP_ERROR", error)
    return failure("Failed to create group.", 500, "INTERNAL_ERROR")
  }
}
