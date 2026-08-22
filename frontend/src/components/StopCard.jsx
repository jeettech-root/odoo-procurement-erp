import React, { useEffect, useState } from 'react';
import * as api from '../services/itinerary.api';

function formatDateInput(d) {
  if (!d) return '';
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth()+1).padStart(2,'0');
  const dd = String(dt.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function StopCard({ stop, index, total, onDelete, onUpdateDates, onMoveUp, onMoveDown, onAssignActivity, onRemoveAssignment, isSelected, onSelect }) {
  const [start, setStart] = useState(formatDateInput(stop.startDate));
  const [end, setEnd] = useState(formatDateInput(stop.endDate));
  const [activities, setActivities] = useState(stop.activities || []);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => { setActivities(stop.activities || []); setStart(formatDateInput(stop.startDate)); setEnd(formatDateInput(stop.endDate)); }, [stop]);

  const saveDates = () => {
    if (!start || !end) return alert('Please provide both start and end date');
    if (new Date(start) > new Date(end)) return alert('Start date must be before end date');
    onUpdateDates(start, end);
  };

  const searchActivities = async () => {
    if (!searchQ) return;
    setSearchLoading(true);
    try {
      const res = await api.searchActivities(searchQ, stop.cityId);
      setSearchResults(res || []);
    } catch (e) { alert('Search error: ' + (e.message || e)); }
    setSearchLoading(false);
  };

  const addActivity = async (activityId) => {
    await onAssignActivity(activityId);
  };

  return (
    <div className={`rounded-lg bg-white p-4 shadow-sm border ${isSelected ? 'border-sky-500 ring-1 ring-sky-200' : 'border-transparent'}`}>
      <div className="flex items-start justify-between">
        <div onClick={onSelect} className="cursor-pointer cursor-move select-none">
          <div className="text-lg font-semibold">{stop.city?.name || 'City not selected'}</div>
          <div className="text-sm text-slate-500">{stop.city?.country}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={onMoveUp} disabled={index===0} className="px-2 py-1 text-sm bg-slate-100 rounded">↑</button>
          <button onClick={onMoveDown} disabled={index===total-1} className="px-2 py-1 text-sm bg-slate-100 rounded">↓</button>
          <button onClick={onDelete} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-600">Start</label>
          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="mt-1 w-full px-2 py-1 border rounded" />
        </div>
        <div>
          <label className="text-xs text-slate-600">End</label>
          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="mt-1 w-full px-2 py-1 border rounded" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={saveDates} className="px-3 py-1 bg-sky-600 text-white rounded">Save dates</button>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Activities</h4>
        <div className="mt-2 space-y-2">
          {activities.length === 0 && <div className="text-sm text-slate-500">No activities assigned</div>}
          {activities.map(a => (
            <div key={a.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{a.activity?.name}</div>
                <div className="text-sm text-slate-500">{a.activity?.description}</div>
              </div>
              <div>
                <button onClick={()=>onRemoveAssignment(a.id)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <div className="text-sm text-slate-500">Add activity</div>
          <div className="flex gap-2 mt-2">
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search activities" className="flex-1 px-2 py-1 border rounded" />
            <button onClick={searchActivities} className="px-3 py-1 bg-purple-600 text-white rounded">Search</button>
          </div>
          {searchLoading && <div className="text-sm text-slate-500 mt-2">Searching…</div>}
          <div className="mt-2 space-y-2">
            {searchResults.map(r => (
              <div key={r.id} className="p-2 border rounded flex items-center justify-between bg-slate-50">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-slate-500">{r.description}</div>
                </div>
                <div>
                  <button onClick={()=>addActivity(r.id)} className="px-2 py-1 bg-sky-600 text-white rounded">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
