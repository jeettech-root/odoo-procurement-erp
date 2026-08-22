import React, { useState } from 'react';
import * as api from '../services/itinerary.api';

export default function CitySearch({ onAddCity }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const r = await api.searchCities(query);
      setResults(r || []);
    } catch (e) { setError(e.message || String(e)); }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search city by name" className="flex-1 px-3 py-2 border rounded-md" />
        <button onClick={search} className="px-3 py-2 bg-sky-600 text-white rounded-md">Search</button>
      </div>
      {loading && <p className="text-sm text-slate-500 mt-2">Searching…</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-3 space-y-2">
        {searched && results.length === 0 && !loading && (
          <div className="rounded p-3 bg-white text-slate-500">No cities found. Try a different name.</div>
        )}

        {results.map(c => (
          <div key={c.id} className="p-3 rounded-md border bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {c.imageUrl && <img src={c.imageUrl} alt={c.name} className="w-16 h-12 object-cover rounded" />}
              <div>
                <div className="font-medium">{c.name} {c.country ? <span className="text-sm text-slate-500">• {c.country}</span> : null}</div>
                {c.region && <div className="text-sm text-slate-500">{c.region}</div>}
                {c.description && <div className="text-sm text-slate-500 mt-1">{c.description}</div>}
              </div>
            </div>
            <div>
              <button onClick={() => onAddCity(c.id)} className="px-3 py-1 bg-purple-600 text-white rounded-md">Add stop</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
