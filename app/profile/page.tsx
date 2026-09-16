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
      <div className="mx-auto max-w-4xl">
        <div className="workspace-surface overflow-hidden rounded-[32px]">
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
          <div className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <BackButton />
              <div className="status-pill">Public profile</div>
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:items-end">
              <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-indigo-600 to-sky-500 text-2xl font-black text-white shadow-xl shadow-indigo-500/30">
                {(profile.name ?? "U").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="eyebrow">Your profile</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{profile.name}</h1>
                <p className="text-sm text-slate-500">{profile.handle}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="metric-card rounded-[22px] p-4">
                <p className="text-sm text-slate-500">Followers</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{profile.followersCount}</p>
              </div>
              <div className="metric-card rounded-[22px] p-4">
                <p className="text-sm text-slate-500">Following</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{profile.followingCount}</p>
              </div>
              <div className="metric-card rounded-[22px] p-4">
                <p className="text-sm text-slate-500">Reach</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">8.2k</p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Username
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="quiet-input mt-2 w-full rounded-2xl px-3 py-2.5"
                  placeholder="yourname"
                />
              </label>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-medium text-slate-500">Profile tone</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-slate-800">Thoughtful & engaging</span>
                </div>
              </div>
            </div>

            <label className="mt-5 block text-sm font-medium text-slate-700">
              Bio
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="quiet-input mt-2 min-h-32 w-full rounded-2xl px-3 py-2.5"
                placeholder="Tell people about yourself"
              />
            </label>

            <div className="mt-6 flex items-center justify-end">
              <button onClick={saveProfile} className="primary-action rounded-xl px-5 py-3 text-sm font-semibold">
                Save profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
