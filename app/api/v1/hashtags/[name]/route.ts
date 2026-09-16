import { failure, success } from "@/lib/api/response"
import { getHashtagByName, getPostsByHashtag } from "@/lib/repositories/search.repository"

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params
  const hashtag = await getHashtagByName(name)
  if (!hashtag) return failure("Hashtag not found.", 404, "NOT_FOUND")
  return success({ hashtag, posts: await getPostsByHashtag(hashtag.id) })
}
