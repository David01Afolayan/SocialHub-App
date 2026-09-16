import { auth } from "@/auth"

export async function requireAdminUser() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN")
  }
  return session.user
}
