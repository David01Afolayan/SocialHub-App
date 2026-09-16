import {
  createPostRecord,
  deletePostRecord,
  findPostById,
  updatePostRecord,
} from "@/lib/repositories/post.repository"

export async function createPost(input: {
  content?: string
  mediaUrl?: string
  mediaUrls?: string[]
  authorId: string
  published?: boolean
  scheduledAt?: Date | null
}) {
  const hasContent = Boolean(input.content?.trim())
  const hasMedia = Boolean(input.mediaUrl || input.mediaUrls?.length)

  if (!hasContent && !hasMedia) {
    throw new Error("Post must contain content or media.")
  }

  return createPostRecord(input)
}

export async function getPost(id: string) {
  return findPostById(id)
}

export async function updatePost(
  id: string,
  userId: string,
  data: {
    content?: string
    mediaUrl?: string
    mediaUrls?: string[]
    published?: boolean
    scheduledAt?: Date | null
  }
) {
  const post = await findPostById(id)

  if (!post) {
    throw new Error("POST_NOT_FOUND")
  }

  if (post.authorId !== userId) {
    throw new Error("FORBIDDEN")
  }

  return updatePostRecord(id, data)
}

export async function deletePost(id: string, userId: string) {
  const post = await findPostById(id)

  if (!post) {
    throw new Error("POST_NOT_FOUND")
  }

  if (post.authorId !== userId) {
    throw new Error("FORBIDDEN")
  }

  return deletePostRecord(id)
}
