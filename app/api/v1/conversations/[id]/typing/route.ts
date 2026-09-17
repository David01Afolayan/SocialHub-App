import { auth } from "@/auth"
import { failure, success } from "@/lib/api/response"
import { requireConversationMember } from "@/lib/services/conversation-auth.service"
import { triggerConversationEvent } from "@/lib/conversation-events"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) return failure("Unauthorized.", 401, "UNAUTHORIZED")
  const { id } = await context.params
  try {
    await requireConversationMember(id, session.user.id)
    const body = await request.json()
    await triggerConversationEvent(id, "typing", {
      userId: session.user.id,
      isTyping: Boolean(body?.isTyping),
    })
    return success({ sent: true })
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("Forbidden.", 403, "FORBIDDEN")
    console.error("TYPING_EVENT_ERROR", error)
    return failure("Failed to send typing indicator.", 500, "INTERNAL_ERROR")
  }
}
