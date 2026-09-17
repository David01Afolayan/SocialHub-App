import { getPusher } from "@/lib/pusher"

export async function triggerConversationEvent(conversationId: string, event: string, data: unknown) {
  try {
    await getPusher().trigger(`private-conversation-${conversationId}`, event, data)
  } catch (error) {
    console.error("CONVERSATION_EVENT_ERROR", { conversationId, event, error })
  }
}
