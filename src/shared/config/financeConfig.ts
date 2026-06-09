export const FINANCE_TYPE_OPTIONS = ["income", "expense", "saving"] as const;
export type FinanceTypeOption = (typeof FINANCE_TYPE_OPTIONS)[number];

export const INCOME_CATEGORIES = [
  "salary",
  "capital_gains",
  "freelance",
  "other",
] as const;
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const EXPENSE_CATEGORIES = [
  "housing",
  "food",
  "transport",
  "health",
  "entertainment",
  "taxes",
  "debt",
  "sporadic",
  "other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const SAVING_ALLOCATION_CATEGORIES = [
  "emergency",
  "investment",
  "education",
  "leisure",
  "clothing",
  "other",
] as const;
export type SavingAllocationCategory = (typeof SAVING_ALLOCATION_CATEGORIES)[number];

export const INVESTMENT_TYPES = [
  "stocks",
  "real_estate",
  "business",
  "crypto",
  "other",
] as const;
export type InvestmentType = (typeof INVESTMENT_TYPES)[number];

export const FINANCIAL_GOAL_STATUSES = ["active", "completed", "paused"] as const;
export type FinancialGoalStatus = (typeof FINANCIAL_GOAL_STATUSES)[number];

export const FINANCE_TYPE_LABELS: Record<FinanceTypeOption, string> = {
  income: "Ingreso",
  expense: "Gasto",
  saving: "Ahorro",
};

export const INCOME_CATEGORY_LABELS: Record<IncomeCategory, string> = {
  salary: "Salario",
  capital_gains: "Plusvalías",
  freelance: "Freelance",
  other: "Otros ingresos",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  housing: "Vivienda",
  food: "Comida",
  transport: "Transporte",
  health: "Salud",
  entertainment: "Ocio",
  taxes: "Impuestos",
  debt: "Deudas",
  sporadic: "Gastos esporádicos",
  other: "Otros gastos",
};

export const SAVING_ALLOCATION_LABELS: Record<SavingAllocationCategory, string> = {
  emergency: "Fondo de emergencia",
  investment: "Inversión",
  education: "Formación",
  leisure: "Ocio",
  clothing: "Ropa",
  other: "Otros",
};

export const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  stocks: "Acciones",
  real_estate: "Inmuebles",
  business: "Negocio",
  crypto: "Cripto",
  other: "Otra oportunidad",
};

export const ACHIEVEMENT_THRESHOLD = {
  beginner: 1,
  intermediate: 5,
  advanced: 10,
  expert: 20,
};
