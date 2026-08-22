import { useState, useEffect } from 'react';

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    category: 'TRANSPORT',
    amount: '',
    description: '',
    date: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description || '',
        date: expense.date ? expense.date.split('T')[0] : '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    onSubmit({
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description || null,
      date: formData.date || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none"
        >
          <option value="TRANSPORT">Transport</option>
          <option value="STAY">Stay</option>
          <option value="ACTIVITY">Activity</option>
          <option value="MEAL">Meal</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What was this for?"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Date (Optional)</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-sky-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          {expense ? 'Update' : 'Add'} Expense
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
