import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TripForm from '../components/TripForm';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/trip.api';

function formatDate(value) { return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)); }

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    tripService.getTrip(token, id).then((result) => { if (active) setTrip(result); }).catch((requestError) => { if (active) setError(requestError.message); }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id, token]);

  const updateTrip = async (data) => {
    setIsSubmitting(true); setError('');
    try { setTrip(await tripService.updateTrip(token, id, data)); setIsEditing(false); } catch (requestError) { setError(requestError.message); } finally { setIsSubmitting(false); }
  };

  const deleteTrip = async () => {
    if (!window.confirm('Delete this trip? This action cannot be undone.')) return;
    setIsDeleting(true); setError('');
    try { await tripService.deleteTrip(token, id); navigate('/dashboard', { state: { notice: 'Trip deleted.' } }); } catch (requestError) { setError(requestError.message); setIsDeleting(false); }
  };

  if (isLoading) return <PageShell><LoadingState label="Loading trip details..." /></PageShell>;
  if (error && !trip) return <PageShell><ErrorState message={error} onRetry={() => window.location.reload()} /></PageShell>;
  if (!trip) return <PageShell><ErrorState message="This trip could not be found." /></PageShell>;

  return <PageShell><Link to="/dashboard" className="back-link">← Back to my trips</Link>{isEditing ? <section className="panel mt-6 max-w-3xl"><p className="eyebrow">Edit trip</p><h1 className="page-title mb-7">Update your plans</h1><TripForm initialTrip={trip} isSubmitting={isSubmitting} serverError={error} onSubmit={updateTrip} onCancel={() => setIsEditing(false)} /></section> : <section className="panel mt-6 max-w-4xl"><div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow">Trip details</p><h1 className="page-title">{trip.title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{trip.description || 'No description added yet.'}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => setIsEditing(true)} className="button-secondary">Edit</button><button type="button" onClick={deleteTrip} disabled={isDeleting} className="button-danger">{isDeleting ? 'Deleting...' : 'Delete'}</button></div></div>{error ? <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}<dl className="mt-10 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2"><DateDetail label="Starts" value={formatDate(trip.startDate)} /><DateDetail label="Ends" value={formatDate(trip.endDate)} /></dl></section>}</PageShell>;
}

function DateDetail({ label, value }) { return <div className="rounded-2xl bg-slate-50 p-5"><dt className="eyebrow">{label}</dt><dd className="mt-2 text-lg font-bold text-slate-900">{value}</dd></div>; }
function PageShell({ children }) { return <main className="app-shell"><div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">{children}</div></main>; }
function LoadingState({ label }) { return <div className="panel flex min-h-56 items-center justify-center"><div className="flex items-center gap-3 text-sm font-medium text-slate-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />{label}</div></div>; }
function ErrorState({ message, onRetry }) { return <div className="panel"><div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>{onRetry ? <button type="button" onClick={onRetry} className="button-secondary mt-5">Try again</button> : null}</div>; }