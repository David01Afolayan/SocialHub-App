type StatCardProps = {
  title: string
  value: string | number
  description?: string
}

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="metric-card rounded-2xl p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {description ? <p className="mt-1 text-xs text-slate-400">{description}</p> : null}
    </div>
  )
}
