import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SidebarItem from '../components/dashboard/SidebarItem';
import { useAuth } from '../context/AuthContext';
import TimelineView from '../components/TimelineView';
import { timelineService } from '../services/timelineService';

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

export default function TimelinePage() {
  const { tripId: routeTripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const selectedTripId = routeTripId || new URLSearchParams(location.search).get('tripId');
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(Boolean(selectedTripId));
  const [error, setError] = useState(null);
  const sidebarItems = getSidebarItems(location.pathname);

  const fetchTimeline = async () => {
    if (!selectedTripId || !token) {
      setTimeline(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await timelineService.getTimeline(selectedTripId, token);
      setTimeline(data);
    } catch (err) {
      setError(err.message || 'Failed to load timeline');
      setTimeline(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTripId) {
      setTimeline(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (token) {
      fetchTimeline();
    }
  }, [selectedTripId, token]);

  const displayName = user?.name || 'Traveler';

  if (!selectedTripId) {
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
              <div className="flex items-center justify-between gap-3">
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
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-600"
                    aria-label="Notifications"
                  >
                    🔔
                  </button>
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

            <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Calendar</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Select a trip</h1>
              <p className="mt-3 max-w-xl text-slate-600">
                Choose a trip to view its schedule, stops, and day-by-day timeline.
              </p>
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="mt-6 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Go to My Trips
              </button>
            </section>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
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
          <main className="flex-1 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-center text-slate-600">Loading timeline...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
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
          <main className="flex-1 rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={fetchTimeline}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </main>
        </div>
      </div>
    );
  }

  if (!timeline) {
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
          <main className="flex-1 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-600">No timeline data available for this trip.</p>
          </main>
        </div>
      </div>
    );
  }

  const tripTitle = timeline.trip?.title || 'Trip';
  const tripStart = timeline.trip?.startDate ? new Date(timeline.trip.startDate).toLocaleDateString() : 'Not available';
  const tripEnd = timeline.trip?.endDate ? new Date(timeline.trip.endDate).toLocaleDateString() : 'Not available';

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

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Calendar</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{tripTitle}</h1>
                <p className="mt-2 text-slate-600">{tripStart} - {tripEnd}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/trips')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Back to My Trips
                </button>
              </div>
            </div>
          </section>

          <div className="mt-6">
            <TimelineView days={timeline.days || []} />
          </div>
        </main>
      </div>
    </div>
  );
}
