import { prisma } from '../utils/prisma.js';

export async function getTripExpenses(tripId) {
  return prisma.expense.findMany({
    where: { tripId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createExpense(tripId, data) {
  const { category, amount, description, date } = data;
  return prisma.expense.create({
    data: {
      tripId,
      category,
      amount,
      description: description || null,
      date: date ? new Date(date) : null,
    },
  });
}

export async function updateExpense(expenseId, data) {
  const updateData = {};
  if (data.category !== undefined) updateData.category = data.category;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;

  return prisma.expense.update({
    where: { id: expenseId },
    data: updateData,
  });
}

export async function deleteExpense(expenseId) {
  return prisma.expense.delete({
    where: { id: expenseId },
  });
}

export async function getTripBudget(tripId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    return null;
  }

  const expenses = await getTripExpenses(tripId);

  const categoryTotals = {
    transport: 0,
    stay: 0,
    activity: 0,
    meal: 0,
    other: 0,
  };

  let totalExpense = 0;
  expenses.forEach((exp) => {
    const category = exp.category.toLowerCase();
    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += exp.amount;
    }
    totalExpense += exp.amount;
  });

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const costPerDay = daysCount > 0 ? totalExpense / daysCount : 0;

  const totalBudget = 50000;
  const remainingBudget = totalBudget - totalExpense;
  const budgetUsed = totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0;
  const isOverBudget = remainingBudget < 0;
  const overBudgetAmount = isOverBudget ? Math.abs(remainingBudget) : 0;

  return {
    trip: {
      id: trip.id,
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
    },
    totalBudget: parseFloat(totalBudget.toFixed(2)),
    estimatedCost: {
      total: parseFloat(totalExpense.toFixed(2)),
      transport: parseFloat(categoryTotals.transport.toFixed(2)),
      stay: parseFloat(categoryTotals.stay.toFixed(2)),
      activity: parseFloat(categoryTotals.activity.toFixed(2)),
      meal: parseFloat(categoryTotals.meal.toFixed(2)),
      other: parseFloat(categoryTotals.other.toFixed(2)),
    },
    metrics: {
      costPerDay: parseFloat(costPerDay.toFixed(2)),
      remainingBudget: parseFloat(remainingBudget.toFixed(2)),
      budgetUsed: parseFloat(budgetUsed.toFixed(2)),
      isOverBudget,
      overBudgetAmount: parseFloat(overBudgetAmount.toFixed(2)),
    },
    expenses,
  };
}
