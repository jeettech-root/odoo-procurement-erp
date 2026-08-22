import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { timelineService } from '../services/timelineService';
import TimelineView from '../components/TimelineView';

export default function TimelinePage() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timelineService.getTimeline(tripId, token);
      setTimeline(data);
    } catch (err) {
      setError(err.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId && token) {
      fetchTimeline();
    }
  }, [tripId, token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-slate-600">Loading timeline...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={fetchTimeline}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!timeline) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-600">No timeline data available</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{timeline.trip.title} - Timeline</h1>
          <p className="mt-2 text-slate-600">
            {new Date(timeline.trip.startDate).toLocaleDateString()} -{' '}
            {new Date(timeline.trip.endDate).toLocaleDateString()}
          </p>
        </div>

        <TimelineView days={timeline.days} />
      </div>
    </main>
  );
}
