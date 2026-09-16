"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isRegister) {
      // 1. Register first
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) return alert("Register failed")
    }

    // 2. Then login
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (result?.error) alert(result.error)
    else router.push("/")
  }

  return (
    <div className="app-canvas flex min-h-screen items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="workspace-surface w-full max-w-md space-y-5 rounded-[28px] p-7 md:p-9">
        <div className="text-center">
          <p className="eyebrow">SocialHub workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {isRegister ? "Create Account" : "Login"}
          </h1>
        </div>
        
        {isRegister && (
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="quiet-input w-full rounded-xl px-3 py-2.5"
            required
          />
        )}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="quiet-input w-full rounded-xl px-3 py-2.5"
          required
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          className="quiet-input w-full rounded-xl px-3 py-2.5"
          required
        />
        
        <button type="submit" className="primary-action w-full rounded-xl p-2.5 text-sm font-semibold">
          {isRegister ? "Sign Up" : "Sign In"}
        </button>

        <button 
          type="button" 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Sign in with Google
        </button>

        <p 
          onClick={() => setIsRegister(!isRegister)} 
          className="cursor-pointer text-center text-sm font-semibold text-blue-700 hover:underline"
        >
          {isRegister ? "Already have an account? Login" : "Need an account? Register"}
        </p>
      </form>
    </div>
  )
}