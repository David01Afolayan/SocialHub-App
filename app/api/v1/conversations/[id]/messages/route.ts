import { NextRequest } from "next/server"
import { requireApiUser } from "@/lib/api-auth"
import { failure, success } from "@/lib/api/response"
import {
  getConversationMessages,
  sendMessage,
} from "@/lib/services/message.service"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const user = await requireApiUser(request)

    const { id } = await params
    const cursor = new URL(request.url).searchParams.get("cursor") ?? undefined
    const result = await getConversationMessages(id, user.id, cursor)

    return success(result)
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return failure("Forbidden.", 403, "FORBIDDEN")
    }

    if (error instanceof Error && error.message === "CONVERSATION_NOT_FOUND") {
      return failure("Conversation not found.", 404, "CONVERSATION_NOT_FOUND")
    }

    console.error("GET_MESSAGES_ERROR", error)
    return failure("Failed to load messages.", 500, "INTERNAL_ERROR")
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const user = await requireApiUser(request)

    const { id } = await params
    const body = await request.json()

    if (typeof body?.content !== "string" && !body?.mediaId) {
      return failure("Message content or media is required.", 400, "CONTENT_REQUIRED")
    }

    const message = await sendMessage({
      conversationId: id,
      senderId: user.id,
      content: typeof body.content === "string" ? body.content : "",
      type: typeof body.type === "string" ? body.type : "TEXT",
      replyToId: typeof body.replyToId === "string" ? body.replyToId : null,
      mediaId: typeof body.mediaId === "string" ? body.mediaId : null,
    })

    return success(message, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return failure("Forbidden.", 403, "FORBIDDEN")
    }

    if (error instanceof Error && error.message === "CONVERSATION_NOT_FOUND") {
      return failure("Conversation not found.", 404, "CONVERSATION_NOT_FOUND")
    }

    if (error instanceof Error && error.message === "MESSAGE_EMPTY") {
      return failure("Message cannot be empty.", 400, "MESSAGE_EMPTY")
    }

    if (error instanceof Error && error.message === "MESSAGE_TOO_LONG") {
      return failure("Message cannot exceed 2000 characters.", 400, "MESSAGE_TOO_LONG")
    }

    if (error instanceof Error && error.message === "MEDIA_FORBIDDEN") {
      return failure("Media is not available to this user.", 403, "MEDIA_FORBIDDEN")
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }

    console.error("SEND_MESSAGE_ERROR", error)
    return failure("Failed to send message.", 500, "INTERNAL_ERROR")
  }
}
