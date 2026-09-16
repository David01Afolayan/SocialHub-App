import type { Metadata, Viewport } from "next"
import "./globals.css"
import Providers from "./providers"
import AppShell from "@/components/layout/AppShell"

export const metadata: Metadata = {
  title: {
    default: "SocialHub",
    template: "%s | SocialHub",
  },
  description: "A modern full-stack social networking platform.",
  keywords: ["SocialHub", "social network", "Next.js", "TypeScript", "full-stack"],
  authors: [{ name: "Afolayan David Iyanuoluwa" }],
  openGraph: {
    title: "SocialHub",
    description: "A modern full-stack social networking platform.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}