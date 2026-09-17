"use client"

import { useState } from "react"

type UploadedMedia = { id: string; url: string; mimeType: string }

export default function MediaUploader({ onUploaded }: { onUploaded: (media: UploadedMedia) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      const response = await fetch("/api/v1/media/upload", { method: "POST", body: form })
      const result = await response.json()
      if (!response.ok) throw new Error(result?.error?.message ?? "Upload failed")
      onUploaded(result.data.media)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <label className="cursor-pointer">
      <input type="file" className="hidden" onChange={handleChange} disabled={uploading} />
      <span>{uploading ? "Uploading..." : "Attach file"}</span>
      {error ? <span className="ml-2 text-red-500">{error}</span> : null}
    </label>
  )
}
