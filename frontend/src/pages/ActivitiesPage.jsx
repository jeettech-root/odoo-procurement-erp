import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../components/dashboard/SidebarItem';
import NotificationCenter from '../components/NotificationCenter';
import ProfileMenu from '../components/ProfileMenu';
import { useAuth } from '../context/AuthContext';
import { listActivities, listCities, createActivity } from '../services/itinerary.api';

const getSidebarItems = (pathname) => {
  const budgetActive = pathname === '/budget' || pathname.includes('/budget');
  const calendarActive = pathname === '/timeline' || pathname.includes('/timeline');

  return [
    { label: 'Home', icon: '⌂', path: '/dashboard', active: pathname === '/dashboard' },
    { label: 'My Trips', icon: '✦', path: '/trips', active: pathname === '/trips' },
    { label: 'Itinerary', icon: '✈', path: '/itinerary', active: pathname === '/itinerary' || pathname.includes('/itinerary') },
    { label: 'Activities', icon: '☼', path: '/activities', active: pathname === '/activities' },
    { label: 'Budget', icon: '◌', path: '/budget', active: budgetActive },
    { label: 'Calendar', icon: '☰', path: '/timeline', active: calendarActive },
  ];
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Price available on request';
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  }

  return String(value);
};

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [activities, setActivities] = useState([]);
  const sidebarItems = getSidebarItems(location.pathname);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Activity modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: '', description: '', price: '', durationMins: '', cityId: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Fetch activities and cities
  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [activityData, cityData] = await Promise.all([listActivities(token), listCities(token)]);
      setActivities(Array.isArray(activityData) ? activityData : []);
      setCities(Array.isArray(cityData) ? cityData : []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load activities.');
      setActivities([]);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!token) {
      setLoading(false);
      return undefined;
    }

    // call fetchData but guard isMounted to avoid state updates after unmount
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          activities
            .map((activity) => activity.category || activity.type)
            .filter(Boolean),
        ),
      ).sort(),
    [activities],
  );

  const cityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...cities.map((city) => city.name || city.cityName || city.label).filter(Boolean),
            ...activities
              .map((activity) => activity.cityName || activity.location || activity.city || activity.destination)
              .filter(Boolean),
          ],
        ),
      ).sort(),
    [activities, cities],
  );

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const combinedText = [
        activity.name,
        activity.title,
        activity.description,
        activity.category,
        activity.type,
        activity.location,
        activity.cityName,
        activity.city,
        activity.destination,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || combinedText.includes(query);
      const activityCategory = activity.category || activity.type || '';
      const activityCity = activity.cityName || activity.location || activity.city || activity.destination || '';
      const matchesCategory = !selectedCategory || activityCategory === selectedCategory;
      const matchesCity = !selectedCity || activityCity === selectedCity;

      return matchesQuery && matchesCategory && matchesCity;
    });
  }, [activities, search, selectedCategory, selectedCity]);

  const displayName = user?.name || 'Traveler';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <aside className="w-full rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:w-72 lg:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-lg font-bold text-white shadow-sm">
              G
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Travel</p>
              <h2 className="text-xl font-bold text-slate-900">GlobeTrotter</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/create-trip')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            <span className="text-base">＋</span>
            New Trip
          </button>

          <nav className="mt-6 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={item.active}
                onClick={item.path ? () => navigate(item.path) : undefined}
              />
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-700">Weather</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">24°</p>
                <p className="mt-1 text-sm text-slate-600">Sunny conditions</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                ☀
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">No destination selected</p>
          </div>
        </aside>

        <main className="flex-1">
          <header className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="text-lg text-slate-400">⌕</span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search activities, cities, and types"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 xl:justify-end">
                <NotificationCenter />

                <ProfileMenu />
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Explore</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Activities</h1>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-300"
                  aria-label="Filter by category"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-300"
                  aria-label="Filter by city"
                >
                  <option value="">All destinations</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => { setShowAddModal(true); setCreateError(''); setNewActivity({ name: search || '', description: '', price: '', durationMins: '', cityId: '' }); }}
                  className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Add activity
                </button>
              </div>
            </div>
          </section>

          <section className="mt-6">
            {loading ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-medium text-slate-700">Loading activities...</p>
              </div>
            ) : error ? (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
                <p className="text-lg font-semibold text-red-700">Unable to load activities</p>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-lg font-semibold text-slate-800">No activities found</p>
                <p className="mt-2 text-sm text-slate-600">
                  Try a different keyword, category, or destination.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredActivities.map((activity) => {
                  const category = activity.category || activity.type || 'General';
                const location = (activity.city && activity.city.name) || activity.cityName || activity.location || activity.city || activity.destination || 'Location not specified';
                  const price = formatCurrency(activity.price ?? activity.cost ?? activity.amount);

                  return (
                    <article
                      key={activity.id}
                      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600">Activity</p>
                          <h3 className="mt-2 text-xl font-bold text-slate-900">
                            {activity.name || activity.title || 'Untitled activity'}
                          </h3>
                        </div>
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                          {category}
                        </span>
                      </div>

                      <div className="mt-5 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                          <span>Location</span>
                          <span className="font-medium text-slate-700">{location}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                          <span>Category</span>
                          <span className="font-medium text-slate-700">{category}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                          <span>Price</span>
                          <span className="font-medium text-slate-700">{price}</span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {activity.description || 'Activity details are being prepared for this trip.'}
                      </p>

                      <button
                        type="button"
                        className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Add to itinerary
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <h3 className="text-lg font-bold">Add Activity</h3>
                <p className="mt-1 text-sm text-slate-600">Create a new activity and associate it with a city.</p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name *</label>
                    <input
                      type="text"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Price (INR)</label>
                      <input
                        type="number"
                        value={newActivity.price}
                        onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Duration (mins)</label>
                      <input
                        type="number"
                        value={newActivity.durationMins}
                        onChange={(e) => setNewActivity({ ...newActivity, durationMins: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">City *</label>
                    <select
                      value={newActivity.cityId}
                      onChange={(e) => setNewActivity({ ...newActivity, cityId: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">Select a city</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}{c.country ? `, ${c.country}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {createError && <p className="text-sm text-red-600">{createError}</p>}
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setCreateError('');
                      if (!newActivity.name || !newActivity.name.trim()) {
                        setCreateError('Activity name is required');
                        return;
                      }
                      if (!newActivity.cityId) {
                        setCreateError('Please select a city');
                        return;
                      }

                      setCreating(true);
                      try {
                        const payload = {
                          name: newActivity.name.trim(),
                          description: newActivity.description || null,
                          price: newActivity.price === '' ? null : Number(newActivity.price),
                          durationMins: newActivity.durationMins === '' ? null : Number(newActivity.durationMins),
                          cityId: newActivity.cityId,
                        };

                        await createActivity(payload, token);

                        // refresh list
                        await fetchData();

                        setShowAddModal(false);
                      } catch (err) {
                        setCreateError(err.message || 'Failed to create activity');
                      } finally {
                        setCreating(false);
                      }
                    }}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : 'Create activity'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
