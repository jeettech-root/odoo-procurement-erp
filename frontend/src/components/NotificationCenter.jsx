import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export default function NotificationCenter({ trips: providedTrips }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [trips, setTrips] = useState(providedTrips || null);

  useEffect(() => {
    if (providedTrips) {
      setTrips(providedTrips);
      return undefined;
    }
    if (!token) return undefined;

    let isMounted = true;
    tripService.getTrips(token)
      .then((data) => {
        if (isMounted) setTrips(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setTrips([]);
      });

    return () => {
      isMounted = false;
    };
  }, [providedTrips, token]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const notifications = useMemo(() => {
    if (!trips) return [];
    if (trips.length === 0) {
      return [{
        id: 'no-trips',
        title: 'Start your next adventure',
        description: "You haven't created a trip yet.",
        path: '/create-trip',
      }];
    }
    const now = new Date();

    return trips
      .filter((trip) => {
        const startDate = new Date(trip.startDate);
        return trip.id && !Number.isNaN(startDate.getTime()) && startDate > now;
      })
      .map((trip) => ({
        id: `upcoming-${trip.id}`,
        title: 'Upcoming trip',
        description: `Your trip “${trip.title || 'Untitled trip'}” is coming up.`,
        date: formatDate(trip.startDate),
        path: `/trips/${trip.id}`,
      }));
  }, [trips]);

  const handleNotificationClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-600 transition hover:bg-slate-100"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        🔔
        {notifications.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <section
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-30 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="border-b border-slate-100 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600">Updates</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">Notifications</h2>
          </div>
          <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
            {!trips ? (
              <p className="px-3 py-8 text-center text-sm text-slate-500">Loading your updates...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification.path)}
                  className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-sky-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-base text-sky-700">✈</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">{notification.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-slate-600">{notification.description}</span>
                    {notification.date ? <span className="mt-2 block text-xs font-medium text-slate-400">Starts {notification.date}</span> : null}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-700">✓</span>
                <p className="mt-3 text-sm font-semibold text-slate-800">You&apos;re all caught up</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  There are no new trip updates right now.
                </p>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}