export type ConversationMember = {
  id: string
  userId: string
  role: string
  user: { id: string; name: string | null; username: string | null; image: string | null }
}

export type MessageReaction = {
  id: string
  userId: string
  type: string
  createdAt: string
}

export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  type: string
  content: string
  mediaId?: string | null
  createdAt: string
  updatedAt: string
  readAt?: string | null
  sender: { id: string; name: string | null; username: string | null; image: string | null }
  replyTo?: { id: string; content: string; sender: { id: string; name: string | null; username: string | null } } | null
  reactions: MessageReaction[]
}

export type Conversation = {
  id: string
  name: string | null
  image: string | null
  isGroup: boolean
  createdAt: string
  updatedAt: string
  members: ConversationMember[]
  messages?: ChatMessage[]
  _count?: { messages: number }
}
