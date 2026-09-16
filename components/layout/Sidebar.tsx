"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { navigationItems } from "./navigation-items"

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200/80 bg-white/70 px-4 py-6 lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white">S</div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">SocialHub</p>
          <p className="text-sm font-semibold text-slate-900">Workspace</p>
        </div>
      </div>
      <nav aria-label="Primary navigation" className="space-y-1">
        {navigationItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <span aria-hidden="true" className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
        {session?.user?.role === "ADMIN" ? (
          <Link href="/admin" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${pathname === "/admin" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <span aria-hidden="true" className="w-5 text-center">▣</span> Admin
          </Link>
        ) : null}
      </nav>
    </aside>
  )
}
