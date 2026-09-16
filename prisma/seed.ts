import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("DemoPassword123!", 10)
  const user = await prisma.user.upsert({
    where: { email: "demo@socialhub.dev" },
    update: {},
    create: {
      name: "Demo User",
      username: "demo_user",
      email: "demo@socialhub.dev",
      password,
    },
  })

  await prisma.post.upsert({
    where: { id: "demo-welcome-post" },
    update: {},
    create: {
      id: "demo-welcome-post",
      content: "Welcome to SocialHub 🚀",
      authorId: user.id,
      published: true,
      mediaUrls: [],
    },
  })
}

main()
  .catch((error) => {
    console.error("SEED_ERROR", error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
