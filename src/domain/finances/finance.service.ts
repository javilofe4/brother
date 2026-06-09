import type {
  EmergencyFund,
  FinancialGoal,
  InvestmentOpportunity,
  SavingAllocation,
  FinanceEntry,
} from "./finance.types";

export function sumBy<T extends { amount: number }>(items: T[]) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function getTotalsByCategory(entries: FinanceEntry[]) {
  return entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] ?? 0) + entry.amount;
    return acc;
  }, {});
}

export function calculateMonthlySummary(entries: FinanceEntry[]) {
  const income = sumBy(entries.filter((entry) => entry.type === "income"));
  const expenses = sumBy(entries.filter((entry) => entry.type === "expense"));
  const savings = sumBy(entries.filter((entry) => entry.type === "saving"));
  const balance = income - expenses - savings;
  return { income, expenses, savings, balance };
}

export function getActiveFinancialGoal(goals: FinancialGoal[]) {
  return goals.find((goal) => goal.status === "active");
}

export function calculateGoalProgress(goal: FinancialGoal) {
  if (!goal || goal.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
}

export function calculateEmergencyFundProgress(fund: EmergencyFund | undefined) {
  if (!fund || fund.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((fund.currentAmount / fund.targetAmount) * 100));
}

export function getSavingAllocationTotals(allocations: SavingAllocation[]) {
  return allocations.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});
}

export function getInvestmentOpportunitiesByUser(
  opportunities: InvestmentOpportunity[],
  userId: string
) {
  return opportunities.filter((item) => item.userId === userId);
}
