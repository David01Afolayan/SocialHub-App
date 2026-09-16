import {
  createConversationRecord,
  createGroupConversation,
  findConversationById,
  findConversationForMembers,
} from "@/lib/repositories/conversation.repository"

export async function getConversation(id: string, userId: string) {
  const conversation = await findConversationById(id)

  if (!conversation) {
    throw new Error("CONVERSATION_NOT_FOUND")
  }

  if (!conversation.members.some((member) => member.userId === userId)) {
    throw new Error("FORBIDDEN")
  }

  return conversation
}

export async function getOrCreateConversation(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds)]

  if (uniqueUserIds.length < 2) {
    throw new Error("CONVERSATION_REQUIRES_MULTIPLE_MEMBERS")
  }

  const existingConversation = await findConversationForMembers(uniqueUserIds)
  return existingConversation ?? createConversationRecord(uniqueUserIds)
}

export async function createGroup(
  creatorId: string,
  name: string,
  userIds: string[]
) {
  const trimmedName = name.trim()

  if (!trimmedName) {
    throw new Error("GROUP_NAME_REQUIRED")
  }

  if (trimmedName.length > 100) {
    throw new Error("GROUP_NAME_TOO_LONG")
  }

  const uniqueUserIds = [...new Set([creatorId, ...userIds])]

  if (uniqueUserIds.length < 3) {
    throw new Error("GROUP_REQUIRES_THREE_USERS")
  }

  if (uniqueUserIds.length > 100) {
    throw new Error("GROUP_TOO_LARGE")
  }

  return createGroupConversation(
    creatorId,
    trimmedName,
    uniqueUserIds.filter((userId) => userId !== creatorId)
  )
}
