import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <main className="app-canvas px-4 py-8 md:px-6 md:py-10">
      <div className="workspace-surface mx-auto max-w-5xl rounded-[28px] p-7 md:p-10">
        <p className="eyebrow">Operations</p>
        <div className="mt-4">
          <BackButton />
        </div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Admin dashboard</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">A quiet control room for keeping the SocialHub workspace healthy, focused, and ready for its members.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[["Workspace", "SocialHub Pro"], ["Access", "Administrator"], ["Signed in as", session.user.name ?? "Admin"]].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
              <p className="mt-2 font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}