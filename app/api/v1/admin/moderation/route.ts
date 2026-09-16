import { failure, success } from "@/lib/api/response"
import { requireAdminUser } from "@/lib/api-auth"
import { getPendingModerationResults } from "@/lib/repositories/moderation.repository"

export async function GET() {
  try {
    await requireAdminUser()
    return success({ results: await getPendingModerationResults() })
  } catch {
    return failure("Forbidden.", 403, "FORBIDDEN")
  }
}
