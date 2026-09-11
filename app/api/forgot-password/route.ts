import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // TODO: enqueue a password reset email/send token. For now, return a generic success message
    // to avoid revealing whether an account exists.
    return NextResponse.json({ message: "If an account exists for that email, a password reset link has been sent." })
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
