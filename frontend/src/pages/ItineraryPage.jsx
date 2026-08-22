import { useLocation, useNavigate } from 'react-router-dom';
import ItineraryBuilder from '../components/ItineraryBuilder';

export default function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tripId = params.get('tripId');

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Itinerary Builder</h1>
            <p className="mt-1 text-sm text-slate-600">Plan stops and activities for your trip.</p>
          </div>

          {tripId && (
            <button
              type="button"
              onClick={() => navigate('/trips')}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to My Trips
            </button>
          )}
        </header>

        {!tripId ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-slate-800">Select a trip</p>
            <p className="mt-2 text-sm text-slate-600">
              Choose a trip from My Trips to view its itinerary.
            </p>
            <button
              type="button"
              onClick={() => navigate('/trips')}
              className="mt-5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Go to My Trips
            </button>
          </div>
        ) : (
          <ItineraryBuilder tripId={tripId} />
        )}
      </div>
    </main>
  );
}
