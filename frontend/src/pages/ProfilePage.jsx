import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../components/dashboard/SidebarItem';
import { useAuth } from '../context/AuthContext';

const getSidebarItems = (pathname) => [
  { label: 'Home', icon: '⌂', path: '/dashboard', active: pathname === '/dashboard' },
  { label: 'My Trips', icon: '✦', path: '/trips', active: pathname === '/trips' },
  { label: 'Itinerary', icon: '✈', path: '/itinerary', active: pathname === '/itinerary' },
  { label: 'Activities', icon: '☼', path: '/activities', active: pathname === '/activities' },
  { label: 'Profile', icon: '◉', path: '/profile', active: pathname === '/profile' },
];

const formatDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const sidebarItems = getSidebarItems(location.pathname);

  const displayName = user?.name || 'Traveler';
  const accountCreated = user?.createdAt ? formatDate(user.createdAt) : 'Not available';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside className="w-full rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:w-72 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-lg font-bold text-white shadow-sm">
              G
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Travel</p>
              <h2 className="text-xl font-bold text-slate-900">GlobeTrotter</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            <span className="text-base">＋</span>
            New Trip
          </button>

          <nav className="mt-6 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={item.active}
                onClick={item.path ? () => navigate(item.path) : undefined}
              />
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="text-lg text-slate-400">⌕</span>
                <input
                  type="text"
                  readOnly
                  value=""
                  placeholder="Search destinations, plans, or tasks"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 xl:justify-end">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-600 transition hover:bg-slate-100"
                  aria-label="Notifications"
                >
                  🔔
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Traveler</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Account</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">Profile</h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Back to Dashboard
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Name</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{user?.name || 'Not available'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Email</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{user?.email || 'Not available'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Role</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{user?.role || 'USER'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Account created</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{accountCreated}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Account status</p>
              <p className="mt-3 text-base text-slate-700">
                This account is read-only. Profile information is provided from the authenticated session and cannot be edited here.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
