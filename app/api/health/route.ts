import { prisma } from "@/lib/prisma"

export async function GET() {
  const started = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return Response.json({
      status: "ok",
      database: "connected",
      uptime: process.uptime(),
      responseTime: `${Date.now() - started}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return Response.json({ status: "error", database: "disconnected" }, { status: 503 })
  }
}
