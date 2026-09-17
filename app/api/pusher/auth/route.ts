import { auth } from "@/auth"
import { getPusher } from "@/lib/pusher"
import { requireConversationMember } from "@/lib/services/conversation-auth.service"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.formData()
    const socketId = body.get("socket_id")
    const channelName = body.get("channel_name")

    if (typeof socketId !== "string" || typeof channelName !== "string") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 })
    }
    if (channelName !== `private-user-${session.user.id}`) {
      const match = channelName.match(/^private-conversation-(.+)$/)
      if (!match) return NextResponse.json({ error: "Forbidden." }, { status: 403 })
      try {
        await requireConversationMember(match[1], session.user.id)
      } catch {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 })
      }
    }

    return NextResponse.json(getPusher().authorizeChannel(socketId, channelName))
  } catch (error) {
    console.error("PUSHER_AUTH_ERROR", error)
    return NextResponse.json({ error: "Unable to authorize channel." }, { status: 500 })
  }
}
