"use client"

import { useRouter } from "next/navigation"

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back()
        else router.push(fallback)
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:border-blue-300 hover:text-blue-700"
    >
      <span aria-hidden="true">&larr;</span>
      Back
    </button>
  )
}
