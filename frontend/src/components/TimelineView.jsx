export default function TimelineView({ days }) {
  if (!days || days.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-center text-slate-600">No timeline data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day.date} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-8 py-6">
            <h2 className="text-lg font-bold text-slate-900">
              Day {day.dayNumber} · {new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
          </div>

          <div className="p-8">
            {day.stops.length === 0 ? (
              <p className="text-slate-600">No activities planned for this day</p>
            ) : (
              <div className="space-y-6">
                {day.stops.map((stop) => (
                  <div key={stop.id} className="border-l-4 border-sky-600 pl-6">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{stop.city.name}</h3>
                      {stop.city.country && (
                        <span className="text-sm text-slate-600">{stop.city.country}</span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {new Date(stop.startDate).toLocaleDateString()} -{' '}
                      {new Date(stop.endDate).toLocaleDateString()}
                    </p>

                    {stop.notes && (
                      <p className="mt-3 text-sm text-slate-700 italic">{stop.notes}</p>
                    )}

                    {stop.activities && stop.activities.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <p className="text-sm font-semibold text-slate-700">Activities:</p>
                        {stop.activities.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                  {assignment.activity.name}
                                </p>
                                {assignment.activity.description && (
                                  <p className="mt-1 text-sm text-slate-600">
                                    {assignment.activity.description}
                                  </p>
                                )}
                              </div>
                              {assignment.activity.price && (
                                <div className="ml-4 text-right">
                                  <p className="text-sm font-semibold text-slate-900">
                                    ₹ {assignment.activity.price.toFixed(2)}
                                  </p>
                                </div>
                              )}
                            </div>

                            {assignment.activity.durationMins && (
                              <p className="mt-2 text-xs text-slate-600">
                                ⏱ {Math.floor(assignment.activity.durationMins / 60)}h
                                {assignment.activity.durationMins % 60 > 0
                                  ? ` ${assignment.activity.durationMins % 60}m`
                                  : ''}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
