import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function requireAdmin() {
  const session = await auth()

  if (!session?.user?.id) {
    return { authorized: false, user: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  if (!user || user.role !== "ADMIN") {
    return { authorized: false, user }
  }

  return { authorized: true, user }
}
