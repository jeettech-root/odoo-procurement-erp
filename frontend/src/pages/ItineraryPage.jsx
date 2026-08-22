import React, { useEffect, useState } from 'react';
import ItineraryBuilder from '../components/ItineraryBuilder';

export default function ItineraryPage() {
  // tripId passed via query param ?tripId=...
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('tripId');

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Itinerary Builder</h1>
          <p className="mt-1 text-sm text-slate-600">Plan stops and activities for your trip.</p>
        </header>

        {!tripId ? (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-slate-700">No trip selected. Open this page with a tripId query parameter, e.g. <code>?tripId=&lt;your-trip-id&gt;</code></p>
          </div>
        ) : (
          <ItineraryBuilder tripId={tripId} />
        )}
      </div>
    </main>
  );
}
