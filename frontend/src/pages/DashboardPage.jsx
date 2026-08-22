import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/trip.api';

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(location.state?.notice || '');

  const loadTrips = () => {
    setIsLoading(true);
    setError('');
    tripService.getTrips(token).then(setTrips).catch((requestError) => setError(requestError.message)).finally(() => setIsLoading(false));
  };

  useEffect(() => { loadTrips(); }, [token]);
  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: {} });
  }, [location, navigate]);

  const createTrip = async (data) => {
    setIsSubmitting(true); setError('');
    try { const trip = await tripService.createTrip(token, data); navigate(`/trips/${trip.id}`); } catch (requestError) { setError(requestError.message); } finally { setIsSubmitting(false); }
  };

  const displayName = user?.name || 'Traveler';
  return <main className="app-shell"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
    <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-lg font-bold text-white">G</div><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">GlobeTrotter</p><p className="text-sm text-slate-500">Welcome, {displayName}</p></div></div><div className="flex items-center gap-3"><button type="button" onClick={logout} className="button-secondary">Log out</button><button type="button" onClick={() => setShowCreate(true)} className="button-primary">+ New trip</button></div></header>
    <section className="py-10 sm:py-14"><p className="eyebrow">My trips</p><h1 className="page-title">Where will you go next?</h1><p className="mt-3 max-w-xl text-base text-slate-600">Keep every journey in one place, from the first idea to the final day.</p></section>
    {notice ? <div role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</div> : null}
    {showCreate ? <section className="panel mb-8 max-w-3xl"><p className="eyebrow">New trip</p><h2 className="mb-7 text-2xl font-bold text-slate-900">Start planning</h2><TripForm isSubmitting={isSubmitting} serverError={error} onSubmit={createTrip} onCancel={() => { setShowCreate(false); setError(''); }} /></section> : null}
    {isLoading ? <LoadingState /> : error && !showCreate ? <ErrorState message={error} onRetry={loadTrips} /> : trips.length === 0 && !showCreate ? <EmptyState onCreate={() => setShowCreate(true)} /> : <div className="grid gap-5 md:grid-cols-2">{trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>}
  </div></main>;
}

function TripCard({ trip }) {
  return <Link to={`/trips/${trip.id}`} className="group flex min-h-56 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400"><div><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-bold text-slate-900 group-hover:text-sky-700">{trip.title}</h2><span className="text-xl text-slate-300 transition group-hover:text-sky-500">→</span></div><p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{trip.description || 'A new adventure waiting to be planned.'}</p></div><div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"><span>{formatDate(trip.startDate)}</span><span className="text-slate-300">to</span><span>{formatDate(trip.endDate)}</span></div></Link>;
}

function EmptyState({ onCreate }) {
  return <section className="panel flex flex-col items-center justify-center px-6 py-16 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-3xl text-sky-600">✦</div><h2 className="mt-6 text-2xl font-bold text-slate-900">Your next adventure starts here.</h2><p className="mt-3 max-w-md text-slate-600">You have not created a trip yet. Give your next destination a name and make it real.</p><button type="button" onClick={onCreate} className="button-primary mt-7">Create new trip</button></section>;
}

function LoadingState() {
  return <div className="grid gap-5 md:grid-cols-2"><div className="min-h-56 animate-pulse rounded-3xl border border-slate-200 bg-white" /><div className="min-h-56 animate-pulse rounded-3xl border border-slate-200 bg-white" /></div>;
}

function ErrorState({ message, onRetry }) {
  return <section className="panel"><div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div><button type="button" onClick={onRetry} className="button-secondary mt-5">Try again</button></section>;
}