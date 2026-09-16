"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/chat", label: "Messages", icon: "✉" },
  { href: "/notifications", label: "Alerts", icon: "♧" },
  { href: "/profile", label: "Profile", icon: "◎" },
]

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-2 backdrop-blur lg:hidden">
      <div className="flex justify-around">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`flex min-w-16 flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[11px] font-medium ${pathname === item.href ? "bg-slate-950 text-white" : "text-slate-500"}`}>
            <span aria-hidden="true" className="text-base">{item.icon}</span>{item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
