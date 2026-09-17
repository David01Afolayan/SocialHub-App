const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_VIDEO_SIZE = 100 * 1024 * 1024
const MAX_AUDIO_SIZE = 50 * 1024 * 1024
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024

const MIME_TYPES: Record<string, { type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT"; max: number }> = {
  "image/jpeg": { type: "IMAGE", max: MAX_IMAGE_SIZE },
  "image/png": { type: "IMAGE", max: MAX_IMAGE_SIZE },
  "image/webp": { type: "IMAGE", max: MAX_IMAGE_SIZE },
  "image/gif": { type: "IMAGE", max: MAX_IMAGE_SIZE },
  "video/mp4": { type: "VIDEO", max: MAX_VIDEO_SIZE },
  "video/webm": { type: "VIDEO", max: MAX_VIDEO_SIZE },
  "video/quicktime": { type: "VIDEO", max: MAX_VIDEO_SIZE },
  "audio/mpeg": { type: "AUDIO", max: MAX_AUDIO_SIZE },
  "audio/wav": { type: "AUDIO", max: MAX_AUDIO_SIZE },
  "application/pdf": { type: "DOCUMENT", max: MAX_DOCUMENT_SIZE },
  "text/plain": { type: "DOCUMENT", max: MAX_DOCUMENT_SIZE },
}

export function validateMedia(mimeType: string, size: number) {
  const definition = MIME_TYPES[mimeType]
  if (!definition || size <= 0 || size > definition.max) {
    throw new Error("Unsupported file type or file is too large")
  }
  return definition.type
}

export function extensionFromMime(mimeType: string) {
  return ({
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "application/pdf": "pdf",
    "text/plain": "txt",
  } as Record<string, string>)[mimeType] ?? "bin"
}
