"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function ProfileSettingsPage() {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile")
        const data = await response.json()
        if (!response.ok) {
          setError(data.error || "Unable to load profile")
          return
        }
        setName(data.name ?? "")
        setUsername(data.username ?? "")
        setBio(data.bio ?? "")
        setImage(data.image ?? "")
      } catch (error) {
        console.error("LOAD_PROFILE_ERROR", error)
        setError("Unable to load profile")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, image }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || "Failed to update profile")
        return
      }
      setName(data.name ?? "")
      setUsername(data.username ?? "")
      setBio(data.bio ?? "")
      setImage(data.image ?? "")
      setMessage("Profile updated successfully.")
    } catch (error) {
      console.error("UPDATE_PROFILE_ERROR", error)
      setError("Something went wrong.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main className="app-canvas flex min-h-screen items-center justify-center p-8 text-sm text-slate-500">Loading profile...</main>
  }

  return (
    <main className="app-canvas min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Back to Profile
        </Link>
        <div className="workspace-surface mt-5 rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Update your public SocialHub profile.</p>

          {error && <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required className="quiet-input mt-2 w-full rounded-xl px-4 py-3" placeholder="Your name" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Username
              <div className="quiet-input mt-2 flex items-center rounded-xl px-4">
                <span className="text-slate-400">@</span>
                <input value={username} onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} maxLength={30} required className="w-full bg-transparent px-2 py-3 outline-none" placeholder="username" />
              </div>
              <span className="mt-1 block text-xs text-slate-400">Letters, numbers and underscores only.</span>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Bio
              <textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={280} rows={4} className="quiet-input mt-2 w-full resize-none rounded-xl px-4 py-3" placeholder="Tell people a little about yourself..." />
              <span className="mt-1 block text-right text-xs text-slate-400">{bio.length}/280</span>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Profile Image URL
              <input type="url" value={image} onChange={(event) => setImage(event.target.value)} className="quiet-input mt-2 w-full rounded-xl px-4 py-3" placeholder="https://example.com/profile.jpg" />
            </label>
            {image && <img src={image} alt="Profile preview" className="h-16 w-16 rounded-full object-cover" />}
            <button type="submit" disabled={saving} className="primary-action w-full rounded-xl px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
