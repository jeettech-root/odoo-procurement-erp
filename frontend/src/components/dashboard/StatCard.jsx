export default function StatCard({ label, value, detail, accent = 'sky' }) {
  const accentStyles = {
    sky: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
    violet: 'bg-violet-50 text-violet-700 ring-1 ring-violet-100',
    amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${accentStyles[accent] || accentStyles.sky}`}>
          {label}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
