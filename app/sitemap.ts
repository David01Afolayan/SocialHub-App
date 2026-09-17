import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const posts = await prisma.post.findMany({
    where: { published: true, visibility: "PUBLIC", moderationStatus: "APPROVED" },
    select: { id: true, updatedAt: true },
    take: 5000,
    orderBy: { updatedAt: "desc" },
  })
  return [
    { url: base, lastModified: new Date() },
    ...posts.map((post) => ({ url: `${base}/post/${post.id}`, lastModified: post.updatedAt })),
  ]
}
