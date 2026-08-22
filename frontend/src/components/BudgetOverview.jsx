export default function BudgetOverview({ budget }) {
  const { totalBudget, estimatedCost, metrics } = budget;

  const getStatusColor = () => {
    if (metrics.isOverBudget) return 'text-red-600';
    if (metrics.budgetUsed > 75) return 'text-orange-600';
    return 'text-emerald-600';
  };

  const getStatusBgColor = () => {
    if (metrics.isOverBudget) return 'bg-red-50';
    if (metrics.budgetUsed > 75) return 'bg-orange-50';
    return 'bg-emerald-50';
  };

  const getStatusBorderColor = () => {
    if (metrics.isOverBudget) return 'border-red-200';
    if (metrics.budgetUsed > 75) return 'border-orange-200';
    return 'border-emerald-200';
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Total Budget</p>
        <p className="mt-3 text-2xl font-bold text-slate-900">₹ {totalBudget.toFixed(2)}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Estimated Cost</p>
        <p className="mt-3 text-2xl font-bold text-slate-900">₹ {estimatedCost.total.toFixed(2)}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Cost Per Day</p>
        <p className="mt-3 text-2xl font-bold text-slate-900">₹ {metrics.costPerDay.toFixed(2)}</p>
      </div>

      <div className={`rounded-xl border p-5 ${getStatusBgColor()} ${getStatusBorderColor()}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Remaining Budget</p>
        <p className={`mt-3 text-2xl font-bold ${getStatusColor()}`}>
          {metrics.isOverBudget ? '- ₹' : '₹ '} {Math.abs(metrics.remainingBudget).toFixed(2)}
        </p>
        <p className={`mt-1 text-xs ${getStatusColor()}`}>
          {metrics.isOverBudget
            ? `Over by ₹ ${metrics.overBudgetAmount.toFixed(2)}`
            : `${metrics.budgetUsed.toFixed(1)}% used`}
        </p>
      </div>

      <div className="md:col-span-2 lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Budget Status</p>
            <p className="mt-2 text-sm text-slate-700">
              {metrics.isOverBudget ? (
                <span className="font-semibold text-red-600">⚠️ Over Budget!</span>
              ) : metrics.budgetUsed > 75 ? (
                <span className="font-semibold text-orange-600">⚠️ High Usage (75%+)</span>
              ) : (
                <span className="font-semibold text-emerald-600">✓ Within Budget</span>
              )}
            </p>
          </div>
          <div className="flex-1 pl-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all ${
                  metrics.isOverBudget
                    ? 'bg-red-600'
                    : metrics.budgetUsed > 75
                      ? 'bg-orange-600'
                      : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(metrics.budgetUsed, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-slate-600">{metrics.budgetUsed.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
