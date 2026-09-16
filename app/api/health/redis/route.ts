import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    const result = await redis.ping()

    return NextResponse.json({
      status: result === "PONG" ? "healthy" : "unhealthy",
    })
  } catch (error) {
    console.error("REDIS_HEALTH_ERROR", error)

    return NextResponse.json(
      { status: "unhealthy" },
      { status: 503 }
    )
  }
}
