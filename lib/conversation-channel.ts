"use client"

import { getPusherClient } from "@/lib/pusher-client"

export function subscribeToConversation(conversationId: string) {
  return getPusherClient().subscribe(`private-conversation-${conversationId}`)
}

export function unsubscribeFromConversation(conversationId: string) {
  getPusherClient().unsubscribe(`private-conversation-${conversationId}`)
}
