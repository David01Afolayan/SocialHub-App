import crypto from "crypto"
import sharp from "sharp"
import { prisma } from "@/lib/prisma"
import { deleteObject, uploadObject } from "@/lib/storage/s3"
import { extensionFromMime, validateMedia } from "@/lib/media/validation"

export async function uploadMedia({ userId, file }: { userId: string; file: File }) {
  const type = validateMedia(file.type, file.size)
  const buffer = Buffer.from(await file.arrayBuffer())
  const date = new Date().toISOString().slice(0, 10)
  const key = `users/${userId}/${date}/${crypto.randomUUID()}.${extensionFromMime(file.type)}`
  let url: string | undefined

  try {
    let width: number | undefined
    let height: number | undefined
    if (type === "IMAGE" && file.type !== "image/gif") {
      const metadata = await sharp(buffer).metadata()
      width = metadata.width
      height = metadata.height
      if ((width ?? 0) > 10000 || (height ?? 0) > 10000) {
        throw new Error("Image dimensions are too large")
      }
    }
    url = await uploadObject(key, buffer, file.type)
    const media = await prisma.media.create({
      data: { url, key, fileName: file.name, mimeType: file.type, size: file.size, width, height, uploadedById: userId },
    })
    return { media, type }
  } catch (error) {
    if (url) {
      await deleteObject(key).catch((cleanupError) => {
        console.error("MEDIA_CLEANUP_ERROR", cleanupError)
      })
    }
    throw error
  }
}
