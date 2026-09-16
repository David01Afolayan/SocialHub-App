import { success } from "@/lib/api/response"
import { getTrendingHashtags } from "@/lib/services/trending.service"

export async function GET() {
  return success({ hashtags: await getTrendingHashtags() })
}
