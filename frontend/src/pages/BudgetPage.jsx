import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { budgetService } from '../services/budgetService';
import BudgetOverview from '../components/BudgetOverview';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function BudgetPage() {
  const { tripId } = useParams();
  const { token } = useAuth();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchBudget = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetService.getBudget(tripId, token);
      setBudget(data);
    } catch (err) {
      setError(err.message || 'Failed to load budget');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId && token) {
      fetchBudget();
    }
  }, [tripId, token]);

  const handleAddExpense = async (expenseData) => {
    try {
      if (editingExpense) {
        await budgetService.updateExpense(tripId, editingExpense.id, expenseData, token);
        setEditingExpense(null);
      } else {
        await budgetService.addExpense(tripId, expenseData, token);
      }
      setShowForm(false);
      await fetchBudget();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await budgetService.deleteExpense(tripId, expenseId, token);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-slate-600">Loading budget...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-8">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={fetchBudget}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!budget) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-600">No budget data available</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{budget.trip.title} - Budget</h1>
          <p className="mt-2 text-slate-600">
            {new Date(budget.trip.startDate).toLocaleDateString()} -{' '}
            {new Date(budget.trip.endDate).toLocaleDateString()}
          </p>
        </div>

        <BudgetOverview budget={budget} />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Expenses</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                  + Add Expense
                </button>
              )}
            </div>

            {showForm && (
              <ExpenseForm
                expense={editingExpense}
                onSubmit={handleAddExpense}
                onCancel={handleCloseForm}
              />
            )}

            <ExpenseList
              expenses={budget.expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Category Breakdown</h2>
            <div className="space-y-3">
              {[
                { name: 'Transport', value: budget.estimatedCost.transport, color: 'bg-blue-100 text-blue-700' },
                { name: 'Stay', value: budget.estimatedCost.stay, color: 'bg-green-100 text-green-700' },
                { name: 'Activity', value: budget.estimatedCost.activity, color: 'bg-purple-100 text-purple-700' },
                { name: 'Meal', value: budget.estimatedCost.meal, color: 'bg-orange-100 text-orange-700' },
                { name: 'Other', value: budget.estimatedCost.other, color: 'bg-gray-100 text-gray-700' },
              ].map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className={`rounded px-3 py-1 text-sm font-medium ${cat.color}`}>{cat.name}</span>
                  <span className="font-semibold">₹ {cat.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
