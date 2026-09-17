import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-6 rounded-lg bg-black px-5 py-3 text-white">Go Home</Link>
    </main>
  )
}
