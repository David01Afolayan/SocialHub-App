"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Topbar() {
  const { data: session } = useSession()
  const initials = (session?.user?.name ?? "U").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white">S</span>
          <span className="font-semibold text-slate-900">SocialHub</span>
        </Link>
        <div className="hidden text-sm font-medium text-slate-500 lg:block">Your social workspace</div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/notifications" aria-label="Notifications" title="Notifications" className="rounded-xl p-2 text-lg text-slate-500 hover:bg-slate-100">♧</Link>
          {session ? (
            <>
              <Link href="/profile" aria-label="Open profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-black text-white">{initials}</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:block">Sign out</button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
