import { NextRequest } from "next/server"
import { requireApiUser } from "@/lib/api-auth"
import { failure, success } from "@/lib/api/response"
import { redisRateLimit } from "@/lib/rate-limit"
import { uploadMedia } from "@/lib/services/media.service"

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser(request)
    const rate = await redisRateLimit(`uploads:${user.id}`, 10, 60)
    if (!rate.allowed) return failure("Too many uploads. Try again later.", 429, "RATE_LIMITED")
    const file = (await request.formData()).get("file")
    if (!(file instanceof File)) return failure("File is required.", 400, "FILE_REQUIRED")
    return success(await uploadMedia({ userId: user.id, file }), 201)
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return failure("Authentication required.", 401, "UNAUTHORIZED")
    }
    console.error("MEDIA_UPLOAD_ERROR", error)
    return failure(error instanceof Error ? error.message : "Unable to upload media.", 400, "MEDIA_UPLOAD_FAILED")
  }
}
