import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import {
  getOrCreateConversation,
} from "@/lib/services/conversation.service"
import { failure, success } from "@/lib/api/response"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const currentUserId = session?.user?.id

    if (!currentUserId) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const body = await request.json()
    const userId = typeof body?.userId === "string" ? body.userId.trim() : ""

    if (!userId) {
      return failure("userId is required.", 400, "USER_ID_REQUIRED")
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!targetUser) {
      return failure("User not found.", 404, "USER_NOT_FOUND")
    }

    const conversation = await getOrCreateConversation([
      currentUserId,
      userId,
    ])

    return success(conversation, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "CONVERSATION_REQUIRES_MULTIPLE_MEMBERS") {
      return failure("You cannot create a conversation with yourself.", 400, "CANNOT_MESSAGE_SELF")
    }

    console.error("CREATE_CONVERSATION_ERROR", error)
    return failure("Failed to create conversation.", 500, "INTERNAL_ERROR")
  }
}

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, username: true, image: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, username: true, image: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return success(conversations)
  } catch (error) {
    console.error("GET_CONVERSATIONS_ERROR", error)
    return failure("Failed to load conversations.", 500, "INTERNAL_ERROR")
  }
}
