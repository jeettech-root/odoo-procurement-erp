export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">No expenses yet</p>
        <p className="mt-1 text-xs text-slate-500">Add your first expense to track your spending</p>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      TRANSPORT: 'bg-blue-100 text-blue-700',
      STAY: 'bg-green-100 text-green-700',
      ACTIVITY: 'bg-purple-100 text-purple-700',
      MEAL: 'bg-orange-100 text-orange-700',
      OTHER: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={`rounded px-2 py-1 text-xs font-medium ${getCategoryColor(expense.category)}`}>
                {expense.category}
              </span>
              {expense.description && <p className="text-sm text-slate-700">{expense.description}</p>}
            </div>
            {expense.date && (
              <p className="mt-1 text-xs text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
            )}
          </div>
          <div className="ml-4 flex items-center gap-3">
            <p className="text-lg font-semibold text-slate-900">₹ {expense.amount.toFixed(2)}</p>
            <button
              onClick={() => onEdit(expense)}
              className="rounded px-3 py-1 text-xs font-medium text-sky-600 transition hover:bg-sky-50"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this expense?')) {
                  onDelete(expense.id);
                }
              }}
              className="rounded px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
