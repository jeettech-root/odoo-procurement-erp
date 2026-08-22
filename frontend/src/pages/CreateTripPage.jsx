import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripForm from '../components/TripForm';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const createTrip = async (tripData) => {
    try {
      setIsSubmitting(true);
      setServerError('');
      await tripService.createTrip(token, tripData);
      navigate('/trips', { replace: true });
    } catch (error) {
      setServerError(error.message || 'Unable to create your trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      <main className="mx-auto max-w-3xl">
        <button type="button" onClick={() => navigate('/trips')} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">← My Trips</button>
        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Plan a journey</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Create a new trip</h1>
          <p className="mt-2 text-sm text-slate-600">Give your trip a name and dates. You can add stops, activities, and expenses afterwards.</p>
          <div className="mt-8"><TripForm isSubmitting={isSubmitting} serverError={serverError} onSubmit={createTrip} onCancel={() => navigate('/trips')} /></div>
        </section>
      </main>
    </div>
  );
}
