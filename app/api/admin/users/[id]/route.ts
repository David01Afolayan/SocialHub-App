import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { authorized, user: admin } = await requireAdmin()
    if (!authorized || !admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const role = typeof body.role === "string" ? body.role.toUpperCase() : ""

    if (!["USER", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Role must be USER or ADMIN." }, { status: 400 })
    }
    if (id === admin.id && role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id }, select: { id: true } })
    if (!targetUser) return NextResponse.json({ error: "User not found." }, { status: 404 })

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, username: true, role: true },
    })
    return NextResponse.json({ user })
  } catch (error) {
    console.error("ADMIN_ROLE_UPDATE_ERROR", error)
    return NextResponse.json({ error: "Failed to update user role." }, { status: 500 })
  }
}
