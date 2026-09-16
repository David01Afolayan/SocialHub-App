"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import MobileNav from "./MobileNav"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { status } = useSession()
  const isAuthRoute = pathname.toLowerCase().startsWith("/login")
  const isPublicLanding = pathname === "/" && status !== "authenticated"

  if (isAuthRoute || isPublicLanding) return <>{children}</>

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  )
}
