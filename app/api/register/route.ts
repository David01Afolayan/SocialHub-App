import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 })
  }
}
