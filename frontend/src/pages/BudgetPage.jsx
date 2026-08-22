import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SidebarItem from '../components/dashboard/SidebarItem';
import BudgetOverview from '../components/BudgetOverview';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';

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
    { label: 'Profile', icon: '◉', path: '/profile', active: pathname === '/profile' },
  ];
};

export default function BudgetPage() {
  const { tripId: routeTripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const selectedTripId = routeTripId || new URLSearchParams(location.search).get('tripId');
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(Boolean(selectedTripId));
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const sidebarItems = getSidebarItems(location.pathname);

  const fetchBudget = async () => {
    if (!selectedTripId || !token) {
      setBudget(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [budgetData, expenseData] = await Promise.all([
        budgetService.getBudget(selectedTripId, token),
        budgetService.listExpenses(selectedTripId, token),
      ]);
      setBudget({ ...budgetData, expenses: Array.isArray(expenseData) ? expenseData : [] });
    } catch (err) {
      setError(err.message || 'Failed to load budget');
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTripId) {
      setBudget(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (token) {
      fetchBudget();
    }
  }, [selectedTripId, token]);

  const handleAddExpense = async (expenseData) => {
    try {
      if (!selectedTripId) {
        return;
      }

      if (editingExpense) {
        await budgetService.updateExpense(selectedTripId, editingExpense.id, expenseData, token);
        setEditingExpense(null);
      } else {
        await budgetService.addExpense(selectedTripId, expenseData, token);
      }
      setShowForm(false);
      await fetchBudget();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      if (!selectedTripId) {
        return;
      }
      await budgetService.deleteExpense(selectedTripId, expenseId, token);
      await fetchBudget();
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const displayName = user?.name || 'Traveler';

  if (!selectedTripId) {
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
              onClick={() => navigate('/dashboard')}
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
          </aside>

          <main className="flex-1">
            <header className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="text-lg text-slate-400">⌕</span>
                  <input
                    type="text"
                    readOnly
                    value=""
                    placeholder="Search destinations, plans, or tasks"
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-600"
                    aria-label="Notifications"
                  >
                    🔔
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Budget</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Select a trip</h1>
              <p className="mt-3 max-w-xl text-slate-600">
                Choose a trip to view its budget, expenses, and spending overview.
              </p>
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="mt-6 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Go to My Trips
              </button>
            </section>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
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
          </aside>
          <main className="flex-1 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-center text-slate-600">Loading budget...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
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
          </aside>
          <main className="flex-1 rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={fetchBudget}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </main>
        </div>
      </div>
    );
  }

  if (!budget) {
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
          </aside>
          <main className="flex-1 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-600">No budget data available for this trip.</p>
          </main>
        </div>
      </div>
    );
  }

  const tripTitle = budget.trip?.title || 'Trip';
  const tripStart = budget.trip?.startDate ? new Date(budget.trip.startDate).toLocaleDateString() : 'Not available';
  const tripEnd = budget.trip?.endDate ? new Date(budget.trip.endDate).toLocaleDateString() : 'Not available';

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
            onClick={() => navigate('/dashboard')}
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
        </aside>

        <main className="flex-1">
          <header className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="text-lg text-slate-400">⌕</span>
                <input
                  type="text"
                  readOnly
                  value=""
                  placeholder="Search destinations, plans, or tasks"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 xl:justify-end">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg text-slate-600 transition hover:bg-slate-100"
                  aria-label="Notifications"
                >
                  🔔
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Traveler</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-600">Budget</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{tripTitle}</h1>
                <p className="mt-2 text-slate-600">{tripStart} - {tripEnd}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/trips')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Back to My Trips
                </button>
                {!showForm && (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    + Add Expense
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="mt-6">
            <BudgetOverview budget={budget} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Expenses</h2>
              </div>

              {showForm && (
                <ExpenseForm
                  expense={editingExpense}
                  onSubmit={handleAddExpense}
                  onCancel={handleCloseForm}
                />
              )}

              <ExpenseList
                expenses={budget.expenses || []}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Category Breakdown</h2>
              <div className="mt-5 space-y-3">
                {[
                  { name: 'Transport', value: budget.estimatedCost?.transport || 0, color: 'bg-blue-100 text-blue-700' },
                  { name: 'Stay', value: budget.estimatedCost?.stay || 0, color: 'bg-green-100 text-green-700' },
                  { name: 'Activity', value: budget.estimatedCost?.activity || 0, color: 'bg-purple-100 text-purple-700' },
                  { name: 'Meal', value: budget.estimatedCost?.meal || 0, color: 'bg-orange-100 text-orange-700' },
                  { name: 'Other', value: budget.estimatedCost?.other || 0, color: 'bg-gray-100 text-gray-700' },
                ].map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className={`rounded px-2.5 py-1 text-xs font-medium ${cat.color}`}>{cat.name}</span>
                    <span className="font-semibold text-slate-900">₹ {Number(cat.value || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
