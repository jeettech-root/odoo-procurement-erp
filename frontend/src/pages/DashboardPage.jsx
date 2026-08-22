import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">Dashboard</p>
            <h1 className="mt-3 text-3xl font-bold">Welcome, {user?.name || 'Traveler'}</h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Account</p>
            <p className="mt-3 text-lg font-semibold">{user?.email}</p>
            <p className="mt-1 text-sm text-slate-600">Role: {user?.role}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Status</p>
            <p className="mt-3 text-lg font-semibold text-emerald-600">Authenticated</p>
            <p className="mt-1 text-sm text-slate-600">JWT is active and current user is loaded.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
