export default function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
        active
          ? 'bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      ].join(' ')}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base text-slate-700">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
