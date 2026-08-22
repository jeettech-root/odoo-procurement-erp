import React, { useState } from 'react';
import * as api from '../services/itinerary.api';

export default function CitySearch({ onAddCity, token }) {
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
      const r = await api.searchCities(query, undefined, token);
      setResults(r || []);
    } catch (e) {
      setError(e.message || String(e));
    }
    setLoading(false);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('India');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const openAddModal = () => {
    setRegion('');
    setCountry('India');
    setLat('');
    setLon('');
    setCreateError(null);
    setShowAddModal(true);
  };

  const submitAddCity = async () => {
    if (!query || !query.trim()) return setCreateError('City name is required');
    if (!country || !country.trim()) return setCreateError('Country is required');

    setCreateLoading(true);
    setCreateError(null);
    try {
      const payload = { name: query.trim(), region: region || undefined, country: country.trim(), lat: lat ? Number(lat) : undefined, lon: lon ? Number(lon) : undefined };
      const city = await api.createCity(payload, token);
      // Use returned city (existing or created)
      if (city && city.id) {
        setShowAddModal(false);
        // Immediately add to trip via parent handler
        onAddCity(city.id);
        // Optionally set results to show new city
        setResults([city]);
      } else {
        setCreateError('Could not create city');
      }
    } catch (e) {
      setCreateError(e.message || String(e));
    }
    setCreateLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search city by name" className="flex-1 px-3 py-2 border rounded-md" />
        <button onClick={search} className="px-3 py-2 bg-sky-600 text-white rounded-md">Search</button>
      </div>
      {loading && <p className="text-sm text-slate-500 mt-2">Searching…</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-3 space-y-2">
        {searched && results.length === 0 && !loading && (
          <div className="rounded p-3 bg-white text-slate-500">
            No cities found for "{query}".
            <div className="mt-2">
              <button onClick={openAddModal} className="text-sm text-sky-600">+ Add "{query}" as a new city</button>
            </div>
          </div>
        )}

        {results.map((c) => (
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold">Add "{query}" as a new city</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm">City name</label>
                <input className="w-full mt-1 px-3 py-2 border rounded" value={query} readOnly />
              </div>
              <div>
                <label className="text-sm">State/Region (optional)</label>
                <input className="w-full mt-1 px-3 py-2 border rounded" value={region} onChange={e => setRegion(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Country</label>
                <input className="w-full mt-1 px-3 py-2 border rounded" value={country} onChange={e => setCountry(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Latitude (optional)</label>
                  <input className="w-full mt-1 px-3 py-2 border rounded" value={lat} onChange={e => setLat(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Longitude (optional)</label>
                  <input className="w-full mt-1 px-3 py-2 border rounded" value={lon} onChange={e => setLon(e.target.value)} />
                </div>
              </div>
              {createError && <div className="text-sm text-red-600">{createError}</div>}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="px-3 py-2 rounded border" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={submitAddCity} disabled={createLoading}>{createLoading ? 'Adding…' : 'Add City to Trip'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
