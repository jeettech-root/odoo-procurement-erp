import React, { useState, useEffect } from 'react';
import * as api from '../services/itinerary.api';

export default function ActivitySearch({ selectedStop, onAddActivity, token }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if selectedStop changes, clear previous search
    setResults([]);
    setQuery('');
    setError(null);
  }, [selectedStop]);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const cityId = selectedStop ? selectedStop.cityId : undefined;
      const r = await api.searchActivities(query, cityId, token);
      setResults(r || []);
    } catch (e) {
      setError(e.message || String(e));
    }
    setLoading(false);
  };

  const add = async (activityId) => {
    if (!selectedStop) return alert('Select a stop to add activity to');
    try {
      await onAddActivity(selectedStop.id, activityId);
    } catch (e) {
      alert('Error adding activity: ' + (e.message || e));
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Search activities</h3>
      <div className="text-sm text-slate-500 mb-2">Search activities for the selected stop{selectedStop && selectedStop.city ? ` — ${selectedStop.city.name}` : ''}.</div>
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search activities by name" className="flex-1 px-3 py-2 border rounded-md" />
        <button onClick={search} className="px-3 py-2 bg-purple-600 text-white rounded-md">Search</button>
      </div>

      {loading && <p className="text-sm text-slate-500 mt-2">Searching…</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-3 space-y-3">
        {results.length === 0 && !loading && <div className="text-sm text-slate-500">No activities found. Try a different keyword.</div>}
        {results.map(a => (
          <div key={a.id} className="p-3 bg-white rounded-md shadow-sm border flex items-start gap-4">
            <div className="flex-1">
              <div className="font-medium">{a.name}</div>
              {a.description && <div className="text-sm text-slate-500 mt-1">{a.description}</div>}
              <div className="mt-2 text-sm text-slate-500 flex gap-4">
                {a.duration && <div>Duration: {a.duration}</div>}
                {a.price && <div>Price: {a.price}</div>}
              </div>
            </div>
            <div>
              <button onClick={() => add(a.id)} className="px-3 py-1 bg-sky-600 text-white rounded-md">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
