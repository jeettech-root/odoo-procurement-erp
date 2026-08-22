import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SidebarItem from '../components/dashboard/SidebarItem';
import StatCard from '../components/dashboard/StatCard';
import GlobalSearch from '../components/GlobalSearch';
import NotificationCenter from '../components/NotificationCenter';
import ProfileMenu from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import { getItinerary } from '../services/itinerary.api';
import { tripService } from '../services/tripService';
import { getItinerary } from '../services/itinerary.api';
import { tripService } from '../services/trip.api';

const formatDate = (value, includeYear = true) => {
  if (!value) return 'Not specified';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not specified';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(date);
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Not specified';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Not specified';

  const sameYear = start.getFullYear() === end.getFullYear();
  return `${formatDate(startDate, !sameYear)} – ${formatDate(endDate, !sameYear)}`;
};

const selectRelevantTrip = (trips) => {
  const now = new Date();
  const activeTrips = trips.filter((trip) => {
    const endDate = new Date(trip.endDate);
    return !Number.isNaN(endDate.getTime()) && endDate >= now;
  });

  if (activeTrips.length) {
    return [...activeTrips].sort((left, right) => new Date(left.startDate) - new Date(right.startDate))[0];
  }

  return [...trips]
    .filter((trip) => !Number.isNaN(new Date(trip.endDate).getTime()))
    .sort((left, right) => new Date(right.endDate) - new Date(left.endDate))[0] || null;
};

const getSidebarItems = (pathname) => {
  const budgetActive = pathname === '/budget' || pathname.includes('/budget');
  const calendarActive = pathname === '/timeline' || pathname.includes('/timeline');

  return [
    { label: 'Home', icon: '⌂', path: '/dashboard', active: pathname === '/dashboard' },
    { label: 'My Trips', icon: '✦', path: '/trips', active: pathname === '/trips' },
    { label: 'Itinerary', icon: '✈', path: '/itinerary', active: pathname === '/itinerary' || pathname.includes('/itinerary') },
    { label: 'Activities', icon: '☼', path: '/activities', active: pathname === '/activities' },
    { label: 'Budget', icon: '◌', path: '/budget', active: budgetActive },
    { label: 'Calendar', icon: '☰', path: '/timeline', active: calendarActive },
    { label: 'Profile', icon: '◉', path: '/profile', active: pathname === '/profile' },
  ];
};

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const shortDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

// const formatDate = (value, formatter = dateFormatter) => {
//   const date = value ? new Date(value) : null;
//   return date && !Number.isNaN(date.getTime()) ? formatter.format(date) : 'Not available';
// };

const getDuration = (trip) => {
  if (!trip?.startDate || !trip?.endDate) return 'Not available';
  const days = Math.floor((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1;
  return days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : 'Not available';
};

const getTripStatus = (trip) => {
  if (!trip?.startDate || !trip?.endDate) return 'Not available';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (end < today) return 'Completed';
  return start <= today ? 'Active' : 'Upcoming';
};

const getTravelerCount = (trip) => trip?.travelerCount ?? trip?.travelers ?? trip?.participantCount ?? null;

const groupExpensesByMonth = (expenses) => {
  const months = new Map();
  expenses.forEach((expense) => {
    const date = new Date(expense.date || expense.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const current = months.get(key) || { name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date), value: 0, sort: date.getTime() };
    current.value += Number(expense.amount) || 0;
    months.set(key, current);
  });
  return [...months.values()].sort((a, b) => a.sort - b.sort).map(({ name, value }) => ({ name, value: Number(value.toFixed(2)) }));
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tripState, setTripState] = useState({ status: 'loading', trips: [], error: '' });
  const [itineraryState, setItineraryState] = useState({ status: 'idle', stops: [], error: '' });
  const displayName = user?.name || 'Traveler';
  const sidebarItems = getSidebarItems(location.pathname);

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
                onClick={() => navigate(trip ? `/trips/${trip.id}/budget` : '/trips')}
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
                    onClick={() => navigate(trip ? `/itinerary?tripId=${trip.id}` : '/trips')}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {trip ? plannerItems.map((item) => (
                    <div
                      key={item.title}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(item.path)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(item.path); }}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={[
                            'h-3 w-3 rounded-full',
                            item.status === 'pending' ? 'bg-sky-500' : '',
                            item.status === 'upcoming' ? 'bg-amber-400' : '',
                            item.status === 'draft' ? 'bg-emerald-500' : '',
                            item.status === 'done' ? 'bg-emerald-500' : '',
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
                  )) : <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Create an upcoming trip to see planning actions.</p>}
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
                    onClick={() => navigate(trip ? `/trips/${trip.id}/timeline` : '/trips')}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    Calendar
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {stops.length ? stops.slice(0, 3).map((stop, index) => (
                    <div key={stop.id} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex min-w-[56px] flex-col items-center">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Day {index + 1}</span>
                        <div className="mt-2 h-10 w-px bg-slate-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{stop.city?.name || 'Unnamed stop'}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatDate(stop.startDate, shortDateFormatter)} – {formatDate(stop.endDate, shortDateFormatter)}</p>
                      </div>
                    </div>
                  )) : <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">{trip ? 'No itinerary stops yet.' : 'No upcoming trip selected.'}</p>}
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
                    onClick={() => navigate(trip ? `/trips/${trip.id}/budget` : '/trips')}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    Monthly
                  </button>
                </div>

                <div className="mt-5 h-56">
                  {chartData.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} /><Tooltip cursor={{ fill: '#dbeafe' }} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Expenses']} /><Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#38bdf8" /></BarChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center text-sm text-slate-500">{trip ? 'No expenses have been recorded for this trip.' : 'Select an upcoming trip to view expenses.'}</div>}
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
