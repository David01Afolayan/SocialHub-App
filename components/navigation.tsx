"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Chat" },
  { href: "/analytics", label: "Analytics" },
  { href: "/profile", label: "Profile" },
]

export default function NavigationBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAuthRoute = pathname.toLowerCase().startsWith("/login")
  const hideForPublicHome = pathname === "/" && status !== "authenticated"

  if (pathname === "/chat" || isAuthRoute || hideForPublicHome) return null

  const closeMenu = () => setMobileOpen(false)
  const nameInitials = (session?.user?.name ?? "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="nav-shell sticky top-0 z-40 border-b backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-indigo-500/25">
            S
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">SocialHub</p>
            <p className="text-sm font-semibold text-slate-900">Workspace</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/65 p-1 shadow-sm md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "nav-active-pill bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          {session?.user?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                pathname === "/admin"
                  ? "nav-active-pill bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              Admin
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-slate-200" />
          ) : session ? (
            <>
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-white sm:inline-flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-[10px] font-black text-white">
                  {nameInitials}
                </span>
                {session.user?.name ?? "Profile"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-medium text-white shadow-md shadow-slate-950/20 hover:bg-slate-800"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm md:hidden"
          >
            <span className={`nav-menu-icon ${mobileOpen ? "is-open" : ""}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="nav-mobile-panel border-t border-slate-200 bg-white/90 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${
                    active ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            {session?.user?.role === "ADMIN" ? (
              <Link
                href="/admin"
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 text-sm font-medium ${
                  pathname === "/admin" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Admin
              </Link>
            ) : null}

            {session ? (
              <button
                onClick={() => {
                  closeMenu()
                  signOut({ callbackUrl: "/" })
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-medium text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
