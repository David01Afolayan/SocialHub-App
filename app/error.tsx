"use client"

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-slate-500">We couldn&apos;t load this page.</p>
        <button onClick={() => reset()} className="mt-5 rounded-lg bg-black px-5 py-2 text-white">Try again</button>
      </div>
    </main>
  )
}
