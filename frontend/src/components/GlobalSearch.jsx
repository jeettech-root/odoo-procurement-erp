import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listActivities, listCities } from '../services/itinerary.api';
import { tripService } from '../services/trip.api';

const MIN_QUERY_LENGTH = 2;

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return 'Dates not set';

  const format = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? null
      : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const start = format(startDate);
  const end = format(endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end || 'Dates not set';
};

const includesQuery = (values, query) => values.filter(Boolean).join(' ').toLowerCase().includes(query);

export default function GlobalSearch() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ trips: [], destinations: [], activities: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setQuery('');
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setResults({ trips: [], destinations: [], activities: [] });
      setIsLoading(false);
      setError('');
      return undefined;
    }

    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const [tripsData, citiesData, activitiesData] = await Promise.all([
          tripService.getTrips(token),
          listCities(token),
          listActivities(token),
        ]);

        if (requestId !== requestIdRef.current) return;

        const cities = Array.isArray(citiesData) ? citiesData : [];
        const cityById = new Map(cities.map((city) => [city.id, city]));
        const trips = (Array.isArray(tripsData) ? tripsData : [])
          .filter((trip) => includesQuery([trip.title, trip.description], trimmedQuery))
          .slice(0, 5);
        const destinations = cities
          .filter((city) => includesQuery([city.name, city.country, city.region, city.description], trimmedQuery))
          .slice(0, 5);
        const activities = (Array.isArray(activitiesData) ? activitiesData : [])
          .filter((activity) => includesQuery([
            activity.name,
            activity.title,
            activity.description,
            cityById.get(activity.cityId)?.name,
            cityById.get(activity.cityId)?.country,
          ], trimmedQuery))
          .slice(0, 5);

        setResults({ trips, destinations, activities });
        setIsOpen(true);
      } catch (requestError) {
        if (requestId !== requestIdRef.current) return;
        setResults({ trips: [], destinations: [], activities: [] });
        setError(requestError.message || 'Unable to search right now.');
        setIsOpen(true);
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, token]);

  const hasResults = Object.values(results).some((group) => group.length > 0);
  const showPanel = isOpen && query.trim().length >= MIN_QUERY_LENGTH;
  const selectResult = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className={["flex items-center gap-3 rounded-2xl border bg-slate-50 px-3 py-2.5 transition", showPanel ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200'].join(' ')}>
        <span className="text-lg text-slate-400" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => { if (query.trim().length >= MIN_QUERY_LENGTH) setIsOpen(true); }}
          placeholder="Search destinations, plans, or tasks"
          aria-label="Search destinations, plans, or tasks"
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" aria-label="Searching" /> : null}
      </div>

      {showPanel ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[min(28rem,calc(100vh-8rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {isLoading ? <p className="px-3 py-4 text-sm text-slate-500">Searching your GlobeTrotter data...</p> : null}
          {error ? <p role="alert" className="px-3 py-4 text-sm text-red-600">{error}</p> : null}
          {!isLoading && !error && !hasResults ? <p className="px-3 py-4 text-sm text-slate-500">No results found for '{query.trim()}'</p> : null}

          {!isLoading && !error ? <SearchGroup title="Trips" icon="✦" results={results.trips} renderTitle={(trip) => trip.title || 'Untitled trip'} renderMeta={(trip) => trip.description || formatDateRange(trip.startDate, trip.endDate)} onSelect={(trip) => selectResult(`/trips/${trip.id}`)} /> : null}
          {!isLoading && !error ? <SearchGroup title="Destinations" icon="⌖" results={results.destinations} renderTitle={(city) => city.name} renderMeta={(city) => [city.country, city.region].filter(Boolean).join(' · ') || city.description || 'Destination'} onSelect={() => selectResult('/itinerary')} /> : null}
          {!isLoading && !error ? <SearchGroup title="Activities" icon="☼" results={results.activities} renderTitle={(activity) => activity.name || activity.title || 'Activity'} renderMeta={(activity) => activity.description || 'Open activities'} onSelect={() => selectResult('/activities')} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function SearchGroup({ title, icon, results, renderTitle, renderMeta, onSelect }) {
  if (!results.length) return null;

  return (
    <section aria-label={title} className="py-1">
      <h2 className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      {results.map((result) => (
        <button key={result.id} type="button" onClick={() => onSelect(result)} className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-sky-50 focus:bg-sky-50 focus:outline-none">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sm text-sky-700" aria-hidden="true">{icon}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-800">{renderTitle(result)}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-500">{renderMeta(result)}</span>
          </span>
        </button>
      ))}
    </section>
  );
}