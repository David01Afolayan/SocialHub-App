"use client"
import React, { useState } from "react"
import Link from "next/link"
import BackButton from "@/components/back-button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body?.error || "Request failed")
      } else {
        setMessage("If an account exists for that email, a password reset link has been sent.")
        setEmail("")
      }
    } catch {
      setError("Network error, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_70px_rgba(15,23,42,0.12)] p-6 md:p-8">
        <div className="mb-5">
          <BackButton fallback="/login" />
        </div>

        <div className="text-center">
          <p className="eyebrow">Account access</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Forgot password</h1>
          <p className="mt-2 text-sm text-slate-500">We will send a secure reset link to your inbox.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          {message && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="quiet-input mt-2 w-full rounded-2xl px-3 py-2.5"
              required
              aria-required="true"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button type="submit" className="primary-action rounded-xl px-4 py-2.5 text-sm font-semibold" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <Link href="/login" className="text-sm font-semibold text-indigo-700 hover:underline">Back to login</Link>
          </div>
        </form>
      </div>
    </main>
  )
}
