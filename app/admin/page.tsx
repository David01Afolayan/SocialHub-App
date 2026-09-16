import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const cards = [
    { label: "Workspace", value: "SocialHub Pro" },
    { label: "Access", value: "Administrator" },
    { label: "Signed in as", value: session.user.name ?? "Admin" },
  ]

  return (
    <main className="app-canvas px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="surface-card rounded-[30px] p-7 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Operations</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Admin dashboard</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">A quiet control room for keeping the SocialHub workspace healthy, focused, and ready for its members.</p>
            </div>
            <BackButton />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="metric-card rounded-[24px] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="workspace-surface rounded-[30px] p-6">
            <h2 className="text-xl font-semibold text-slate-900">System health</h2>
            <div className="mt-6 space-y-4">
              {[
                ["Content moderation", "98%"],
                ["Queue stability", "99.4%"],
                ["Member activity", "Stable"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-indigo-200">Overview</p>
            <h3 className="mt-3 text-3xl font-bold">Everything is stable</h3>
            <p className="mt-3 text-sm text-slate-300">No critical incidents or queue slowdowns detected across the current publishing cycle.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
