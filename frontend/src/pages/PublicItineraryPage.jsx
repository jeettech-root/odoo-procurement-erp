import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sharingService } from '../services/sharingService';
import TimelineView from '../components/TimelineView';

export default function PublicItineraryPage() {
  const { shareToken } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublicItinerary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sharingService.getPublicItinerary(shareToken);
      const days = [];
      const trip = data.trip;
      const stops = data.itinerary || [];

      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      let currentDate = new Date(startDate);
      let dayNumber = 1;

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];

        const stopsForDay = stops.filter((stop) => {
          const stopStart = new Date(stop.startDate).toISOString().split('T')[0];
          const stopEnd = new Date(stop.endDate).toISOString().split('T')[0];
          return dateStr >= stopStart && dateStr <= stopEnd;
        });

        days.push({
          date: dateStr,
          dayNumber,
          stops: stopsForDay,
        });

        currentDate.setDate(currentDate.getDate() + 1);
        dayNumber += 1;
      }

      setItinerary({
        trip,
        days,
      });
    } catch (err) {
      setError(err.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareToken) {
      fetchPublicItinerary();
    }
  }, [shareToken]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-slate-600">Loading itinerary...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-red-700">Error: {error}</p>
          <p className="mt-2 text-sm text-red-600">This itinerary is not publicly available or the link has expired.</p>
        </div>
      </main>
    );
  }

  if (!itinerary) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-600">No itinerary data available</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-600">Public Trip</p>
            <h1 className="text-3xl font-bold">{itinerary.trip.title}</h1>
            {itinerary.trip.description && (
              <p className="mt-2 text-slate-600">{itinerary.trip.description}</p>
            )}
            <p className="mt-4 text-sm text-slate-500">
              {new Date(itinerary.trip.startDate).toLocaleDateString()} -{' '}
              {new Date(itinerary.trip.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <TimelineView days={itinerary.days} />
      </div>
    </main>
  );
}
