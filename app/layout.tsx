import type { Metadata, Viewport } from "next"
import "./globals.css"
import Providers from "./providers"
import NavigationBar from "@/components/navigation"

export const metadata: Metadata = {
  title: "SocialHub",
  description: "My Social App",
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
          <NavigationBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}