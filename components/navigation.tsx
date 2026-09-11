"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Chat" },
  { href: "/analytics", label: "Analytics" },
  { href: "/profile", label: "Profile" },
]

export default function NavigationBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === "/chat" || pathname === "/login") return null

  const closeMenu = () => setMobileOpen(false)

  return (
    <header className="nav-shell sticky top-0 z-40 border-b backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-800 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
            S
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">SocialHub</p>
            <p className="text-sm font-semibold text-slate-900">Workspace</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "nav-active-pill bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
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
                    ? "nav-active-pill bg-slate-900 text-white shadow-sm"
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
                className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:inline-flex"
              >
                {session.user?.name ?? "Profile"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 md:hidden"
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
        <div className="nav-mobile-panel border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${
                    active ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
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
                  pathname === "/admin" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
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
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
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
