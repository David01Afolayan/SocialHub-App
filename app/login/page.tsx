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
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
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
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_35px_70px_rgba(15,23,42,0.12)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 p-8 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_30%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <span className="section-tag !bg-white/10 !text-sky-50 !border-white/20">SocialHub</span>
                <h1 className="mt-6 max-w-md text-4xl font-black tracking-tight text-white md:text-5xl">Build a more intentional community.</h1>
                <p className="mt-4 max-w-md text-base text-indigo-100">Plan content, keep conversations flowing, and turn attention into momentum.</p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["12k+", "Members"],
                  ["4.9/5", "Rating"],
                  ["24/7", "Support"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/15 bg-slate-950/10 p-4">
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="mt-1 text-sm text-indigo-100">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 md:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-center">
                <p className="eyebrow">Account access</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{isRegister ? "Create your account" : "Welcome back"}</h2>
                <p className="mt-2 text-sm text-slate-500">{isRegister ? "Build a clearer rhythm for your audience." : "Pick up where your community left off."}</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-describedby={error ? "form-error" : undefined}>
                {error && (
                  <div id="form-error" role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
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
                      className="quiet-input mt-2 w-full rounded-2xl px-3 py-2.5"
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
                    className="quiet-input mt-2 w-full rounded-2xl px-3 py-2.5"
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
                    className="quiet-input mt-2 w-full rounded-2xl px-3 py-2.5"
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
                      className="quiet-input mt-2 w-full rounded-2xl px-3 py-2.5"
                      required={isRegister}
                      aria-required={isRegister}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button type="submit" className="primary-action rounded-xl px-4 py-2.5 text-sm font-semibold" disabled={loading}>
                    {loading ? (isRegister ? "Creating..." : "Signing in...") : (isRegister ? "Sign Up" : "Sign In")}
                  </button>

                  <a href="/login/forgot-password" className="text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline">Forgot password?</a>
                </div>

                <div className="pt-1">
                  <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50">
                    Sign in with Google
                  </button>
                </div>

                <p className="text-center text-sm">
                  <button type="button" onClick={() => setIsRegister(!isRegister)} className="font-semibold text-indigo-700 hover:underline">
                    {isRegister ? "Already have an account? Login" : "Need an account? Register"}
                  </button>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
