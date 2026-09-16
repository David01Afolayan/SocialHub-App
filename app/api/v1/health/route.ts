import { prisma } from "@/lib/prisma"
import { failure, success } from "@/lib/api/response"

export async function GET() {
  const startedAt = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`

    return success({
      status: "ok",
      service: "socialhub-api",
      version: "v1",
      database: "connected",
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startedAt,
    })
  } catch {
    return failure(
      "Database connection is unavailable.",
      503,
      "DATABASE_UNAVAILABLE"
    )
  }
}
