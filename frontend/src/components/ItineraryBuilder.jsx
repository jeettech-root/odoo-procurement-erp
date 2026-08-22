import React, { useEffect, useState } from 'react';
import * as api from '../services/itinerary.api';
import CitySearch from './CitySearch';
import StopCard from './StopCard';
import ActivitySearch from './ActivitySearch';

export default function ItineraryBuilder({ tripId }) {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    api.getItinerary(tripId).then(data => { setStops(data || []); setLoading(false); }).catch(e => { setError(e.message || String(e)); setLoading(false); });
  }, [tripId, refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  const handleAddCityAsStop = async (cityId) => {
    try {
      // default dates: today and +1
      const today = new Date();
      const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
      await api.createStop({ tripId, cityId, startDate: today.toISOString(), endDate: tomorrow.toISOString() });
      refresh();
    } catch (e) {
      alert('Error adding stop: ' + (e.message || e));
    }
  };

  const handleDeleteStop = async (id) => {
    if (!confirm('Remove this stop?')) return;
    await api.deleteStop(id);
    if (selectedStopId === id) setSelectedStopId(null);
    refresh();
  };

  const handleUpdateStopDates = async (id, startDate, endDate) => {
    await api.updateStop(id, { startDate, endDate });
    refresh();
  };

  const handleReorder = async (direction, idx) => {
    // move up or down
    const newStops = [...stops];
    const [moved] = newStops.splice(idx, 1);
    const newIndex = direction === 'up' ? Math.max(0, idx - 1) : Math.min(newStops.length, idx + 1);
    newStops.splice(newIndex, 0, moved);
    const order = newStops.map(s => s.id);
    await api.reorderStops(tripId, order);
    refresh();
  };

  const handleAssignActivity = async (stopId, activityId) => {
    try {
      await api.assignActivityToStop(stopId, { activityId });
      refresh();
    } catch (e) {
      if (e.status === 409) alert('Activity already assigned to this stop');
      else alert('Error assigning activity: ' + (e.message || e));
    }
  };

  const handleRemoveAssignment = async (stopId, assignmentId) => {
    await api.removeActivityFromStop(stopId, assignmentId);
    refresh();
  };

  const selectedStop = stops.find(s => s.id === selectedStopId) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Stops</h2>
          <button onClick={refresh} className="text-sm text-sky-600">Refresh</button>
        </div>

        {loading && <div className="rounded p-6 bg-white shadow-sm">Loading stops...</div>}
        {error && <div className="rounded p-6 bg-red-50 text-red-700">{error}</div>}

        {!loading && stops.length === 0 && (
          <div className="rounded p-6 bg-white shadow-sm">No stops yet — use the city search to add a stop.</div>
        )}

        <div className="space-y-4">
          {stops.map((stop, idx) => (
            <div
              key={stop.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', String(idx));
                e.dataTransfer.effectAllowed = 'move';
                e.currentTarget.classList.add('opacity-70');
                setDraggingIndex(idx);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverIndex !== idx) setDragOverIndex(idx);
              }}
              onDrop={async (e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData('text/plain'));
                const to = idx;
                setDragOverIndex(null);
                setDraggingIndex(null);
                if (isNaN(from)) return;
                if (from === to) return;

                const original = [...stops];
                const next = [...stops];
                const [moved] = next.splice(from, 1);
                next.splice(to, 0, moved);
                // optimistic update
                setStops(next);
                try {
                  const order = next.map(s => s.id);
                  await api.reorderStops(tripId, order);
                } catch (err) {
                  alert('Could not save new order: ' + (err.message || err));
                  setStops(original);
                }
              }}
              onDragEnd={(e) => {
                e.currentTarget.classList.remove('opacity-70');
                setDragOverIndex(null);
                setDraggingIndex(null);
              }}
              className={`${dragOverIndex === idx ? 'border-2 border-dashed border-sky-300 rounded-md' : ''}`}
            >
              <StopCard
                stop={stop}
                index={idx}
                total={stops.length}
                isSelected={selectedStopId === stop.id}
                onSelect={() => setSelectedStopId(stop.id)}
                onDelete={() => handleDeleteStop(stop.id)}
                onUpdateDates={(s,e) => handleUpdateStopDates(stop.id, s, e)}
                onMoveUp={() => handleReorder('up', idx)}
                onMoveDown={() => handleReorder('down', idx)}
                onAssignActivity={(activityId) => handleAssignActivity(stop.id, activityId)}
                onRemoveAssignment={(assignmentId) => handleRemoveAssignment(stop.id, assignmentId)}
              />
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-3">Add a city</h3>
        <CitySearch onAddCity={handleAddCityAsStop} />

        <ActivitySearch selectedStop={selectedStop} onAddActivity={handleAssignActivity} />

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-700">Tips</h4>
          <p className="text-sm text-slate-500 mt-2">Search cities by name and add them as stops. Edit dates and assign activities per stop.</p>
        </div>
      </aside>
    </div>
  );
}
