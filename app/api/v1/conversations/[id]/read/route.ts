import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { markConversationRead } from "@/lib/services/message.service"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    const { id } = await params
    const result = await markConversationRead(id, userId)

    return success({ updated: result.count })
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return failure("Forbidden.", 403, "FORBIDDEN")
    }

    if (error instanceof Error && error.message === "CONVERSATION_NOT_FOUND") {
      return failure("Conversation not found.", 404, "CONVERSATION_NOT_FOUND")
    }

    console.error("MARK_MESSAGES_READ_ERROR", error)
    return failure("Failed to mark messages as read.", 500, "INTERNAL_ERROR")
  }
}
