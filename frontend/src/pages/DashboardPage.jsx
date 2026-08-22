import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import SidebarItem from '../components/dashboard/SidebarItem';
import StatCard from '../components/dashboard/StatCard';
import GlobalSearch from '../components/GlobalSearch';
import NotificationCenter from '../components/NotificationCenter';
import ProfileMenu from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';

const sidebarItems = [
  { label: 'Home', icon: '⌂', path: '/dashboard', active: true },
  { label: 'My Trips', icon: '✦', path: '/trips' },
  { label: 'Itinerary', icon: '✈', path: '/itinerary' },
  { label: 'Activities', icon: '☼', path: '/activities' },
  { label: 'Budget', icon: '◌', path: '/trips/demo/budget' },
  { label: 'Calendar', icon: '☰', path: '/trips/demo/timeline' },
  { label: 'Profile', icon: '◉' },
];

const budgetData = [
  { name: 'Jan', value: 40 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 70 },
  { name: 'May', value: 60 },
  { name: 'Jun', value: 78 },
];

const todoItems = [
  { title: 'Finalize trip plan', meta: 'Checklist item placeholder', tag: 'Pending', status: 'pending' },
  { title: 'Confirm arrival details', meta: 'Travel details placeholder', tag: 'Soon', status: 'upcoming' },
  { title: 'Review budget notes', meta: 'Budget placeholder', tag: 'Draft', status: 'draft' },
];

const timelineItems = [
  { time: '09:00', title: 'Departure window placeholder', detail: 'Travel timeline block' },
  { time: '12:30', title: 'Arrival placeholder', detail: 'Travel checkpoint block' },
  { time: '18:00', title: 'Evening plan placeholder', detail: 'Activity timeline block' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || 'Traveler';

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
            onClick={() => navigate('/create-trip')}
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

          <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-700">Weather</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">24°</p>
                <p className="mt-1 text-sm text-slate-600">Sunny conditions</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                ☀
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">Destination placeholder</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <GlobalSearch />

              <div className="flex items-center justify-between gap-3 xl:justify-end">
                <NotificationCenter />

                <ProfileMenu />
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Dashboard</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Welcome back, <span className="text-sky-700">{displayName}</span>
                </h1>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Quick overview
              </button>
            </div>
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
            <div className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 p-5 text-white shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100">Upcoming trip</p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Nearest trip placeholder</h2>
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-50">
                    Draft
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Destination</p>
                    <p className="mt-3 text-lg font-semibold">TBD</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Departure</p>
                    <p className="mt-3 text-lg font-semibold">TBD</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Travelers</p>
                    <p className="mt-3 text-lg font-semibold">0 guests</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <StatCard label="Travel date" value="TBD" detail="Placeholder date window" accent="sky" />
                <StatCard label="Destination" value="TBD" detail="Placeholder destination" accent="emerald" />
                <StatCard label="Travelers" value="0" detail="Placeholder traveler count" accent="violet" />
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Planner</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">To-do list</h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {todoItems.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={[
                            'h-3 w-3 rounded-full',
                            item.status === 'pending' ? 'bg-sky-500' : '',
                            item.status === 'upcoming' ? 'bg-amber-400' : '',
                            item.status === 'draft' ? 'bg-emerald-500' : '',
                          ].join(' ')}
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.meta}</p>
                        </div>
                      </div>

                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 ring-1 ring-slate-200">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Schedule</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Timeline</h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    Calendar
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {timelineItems.map((item) => (
                    <div key={item.time} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex min-w-[56px] flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.time}</span>
                        <div className="mt-2 h-10 w-px bg-slate-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Budget</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Expenses</h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    Monthly
                  </button>
                </div>

                <div className="mt-5 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: '#dbeafe' }}
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Overview</p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <span className="text-sm text-slate-600">Trip status</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Draft
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <span className="text-sm text-slate-600">Budget</span>
                    <span className="text-sm font-semibold text-slate-900">$0 placeholder</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <span className="text-sm text-slate-600">City</span>
                    <span className="text-sm font-semibold text-slate-900">TBD</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <span className="text-sm text-slate-600">People</span>
                    <span className="text-sm font-semibold text-slate-900">0</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
