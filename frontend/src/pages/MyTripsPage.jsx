import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../components/dashboard/SidebarItem';
import GlobalSearch from '../components/GlobalSearch';
import NotificationCenter from '../components/NotificationCenter';
import ProfileMenu from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';

const getSidebarItems = (pathname) => {
  const budgetActive = pathname === '/budget' || pathname.includes('/budget');
  const calendarActive = pathname === '/timeline' || pathname.includes('/timeline');

  return [
    { label: 'Home', icon: '⌂', path: '/dashboard', active: pathname === '/dashboard' },
    { label: 'My Trips', icon: '✦', path: '/trips', active: pathname === '/trips' },
    { label: 'Itinerary', icon: '✈', path: '/itinerary', active: pathname === '/itinerary' || pathname.includes('/itinerary') },
    { label: 'Budget', icon: '◌', path: '/budget', active: budgetActive },
    { label: 'Calendar', icon: '☰', path: '/timeline', active: calendarActive },
  ];
};

const formatDate = (value) => {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const statusClasses = {
  upcoming: 'bg-amber-100 text-amber-700',
  active: 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-slate-200 text-slate-700',
  default: 'bg-slate-100 text-slate-700',
};

export default function MyTripsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const sidebarItems = getSidebarItems(location.pathname);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return undefined;
    }

    let isMounted = true;

    const loadTrips = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await tripService.getTrips(token);
        if (isMounted) {
          setTrips(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load trips.');
          setTrips([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTrips();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const displayName = user?.name || 'Traveler';

  const pageContent = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-700">Loading your trips...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
          <p className="text-lg font-semibold text-red-700">Unable to load trips</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!trips.length) {
      return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-800">No trips yet</p>
          <p className="mt-2 text-sm text-slate-600">
            Start your next journey by creating a new trip plan.
          </p>
          <button
            type="button"
            onClick={() => navigate('/create-trip')}
            className="mt-5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            New Trip
          </button>
        </div>
      );
    }

    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {trips.map((trip) => {
          const travelerCount = trip.travelerCount ?? trip.travelers ?? trip.participantCount ?? null;
          const status = trip.status || 'Not available';

          return (
            <article key={trip.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600">Trip</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{trip.title || 'Untitled trip'}</h3>
                </div>
                <span
                  className={[
                    'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
                    statusClasses[String(status).toLowerCase()] || statusClasses.default,
                  ].join(' ')}
                >
                  {String(status).toLowerCase() === 'upcoming'
                    ? 'Upcoming'
                    : String(status).toLowerCase() === 'active'
                      ? 'Active'
                      : String(status).toLowerCase() === 'completed'
                        ? 'Completed'
                        : String(status).toLowerCase() === 'draft'
                          ? 'Draft'
                          : 'Status'}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                  <span>Destination</span>
                  <span className="font-medium text-slate-700">{trip.destination || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                  <span>Start</span>
                  <span className="font-medium text-slate-700">{formatDate(trip.startDate)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                  <span>End</span>
                  <span className="font-medium text-slate-700">{formatDate(trip.endDate)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                  <span>Travelers</span>
                  <span className="font-medium text-slate-700">
                    {travelerCount !== null ? travelerCount : 'Not specified'}
                  </span>
                </div>
              </div>

              {trip.description ? <p className="mt-4 text-sm text-slate-600">{trip.description}</p> : null}

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate(`/itinerary?tripId=${trip.id}`)}
                  className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Open trip
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/budget?tripId=${trip.id}`)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Budget
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/timeline?tripId=${trip.id}`)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Calendar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }, [error, loading, navigate, trips]);

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
                <NotificationCenter trips={trips} />

                <ProfileMenu />
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Trips</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">My Trips</h1>
                <p className="mt-2 text-sm text-slate-600">Your trips and upcoming plans.</p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/create-trip')}
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                New Trip
              </button>
            </div>
          </section>

          <div className="mt-6">{pageContent}</div>
        </main>
      </div>
    </div>
  );
}
