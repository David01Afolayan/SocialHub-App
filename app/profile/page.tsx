"use client"

import { useEffect, useState } from "react"
import BackButton from "@/components/back-button"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile")
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setUsername(data.username ?? "")
        setBio(data.bio ?? "")
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  const saveProfile = async () => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio }),
    })

    if (res.ok) {
      const data = await res.json()
      setProfile(data)
    }
  }

  if (loading) return <main className="app-canvas flex items-center justify-center p-8 text-sm text-slate-500">Loading profile...</main>
  if (!profile) return <main className="app-canvas flex items-center justify-center p-8 text-sm text-slate-500">You need to sign in.</main>

  return (
    <main className="app-canvas px-4 py-8 md:px-6 md:py-10">
      <div className="workspace-surface mx-auto max-w-3xl rounded-[28px] p-6 md:p-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-800 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
            {(profile.name ?? "U").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="eyebrow">Your profile</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{profile.name}</h1>
            <p className="text-sm text-slate-500">{profile.handle}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="quiet-input mt-2 w-full rounded-xl px-3 py-2.5"
              placeholder="yourname"
            />
          </label>

          <div className="flex items-end gap-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              {profile.followersCount} followers
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              {profile.followingCount} following
            </div>
          </div>
        </div>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="quiet-input mt-2 min-h-30 w-full rounded-xl px-3 py-2.5"
            placeholder="Tell people about yourself"
          />
        </label>

        <button
          onClick={saveProfile}
          className="primary-action mt-6 rounded-xl px-5 py-3 text-sm font-semibold"
        >
          Save profile
        </button>
      </div>
    </main>
  )
}
