"use client"
import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validate = () => {
    setError("")
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    const emailRe = /\S+@\S+\.\S+/
    if (!emailRe.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!password) {
      setError("Password is required")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (isRegister) {
      if (!name.trim()) {
        setError("Name is required for registration")
        return false
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validate()) return
    setLoading(true)

    try {
      if (isRegister) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || "Registration failed")
        }
      }

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-canvas flex min-h-screen items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="workspace-surface w-full max-w-md space-y-5 rounded-[28px] p-7 md:p-9" aria-describedby={error ? "form-error" : undefined}>
        <div className="text-center">
          <p className="eyebrow">SocialHub workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{isRegister ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-slate-500">{isRegister ? "Build a clearer rhythm for your audience." : "Pick up where your community left off."}</p>
        </div>

        {error && (
          <div id="form-error" role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isRegister && (
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="quiet-input mt-2 w-full rounded-xl px-3 py-2.5"
              required
              aria-required="true"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="quiet-input mt-2 w-full rounded-xl px-3 py-2.5"
            required
            aria-required="true"
            aria-invalid={error.includes("email") || error.includes("Email") ? "true" : "false"}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="quiet-input mt-2 w-full rounded-xl px-3 py-2.5"
            required
            aria-required="true"
            aria-invalid={error.includes("Password") ? "true" : "false"}
          />
        </div>

        {isRegister && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="quiet-input mt-2 w-full rounded-xl px-3 py-2.5"
              required={isRegister}
              aria-required={isRegister}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button type="submit" className="primary-action rounded-xl px-4 py-2.5 text-sm font-semibold" disabled={loading}>
            {loading ? (isRegister ? "Creating..." : "Signing in...") : (isRegister ? "Sign Up" : "Sign In")}
          </button>

          <a href="/login/forgot-password" className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline">Forgot password?</a>
        </div>

        <div>
          <button type="button" onClick={() => signIn("google")} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50">
            Sign in with Google
          </button>
        </div>

        <p className="text-sm text-center mt-2">
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="font-semibold text-blue-700 hover:underline">
            {isRegister ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </p>
      </form>
    </div>
  )
}
