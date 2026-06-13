import { z } from "zod";
import {
  FINANCE_TYPE_OPTIONS,
  FINANCE_TYPE_LABELS as FINANCE_TYPE_LABELS_MAP,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  SAVING_ALLOCATION_CATEGORIES,
  INVESTMENT_TYPES,
  INCOME_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  SAVING_ALLOCATION_LABELS,
  INVESTMENT_TYPE_LABELS,
  FINANCIAL_GOAL_STATUSES,
} from "@/shared/config/financeConfig";

export const FinanceTypeEnum = z.enum(FINANCE_TYPE_OPTIONS);
export type FinanceType = z.infer<typeof FinanceTypeEnum>;
export type FinanceEntryKind = FinanceType;

export const IncomeCategoryEnum = z.enum(INCOME_CATEGORIES);
export type IncomeCategory = z.infer<typeof IncomeCategoryEnum>;

export const ExpenseCategoryEnum = z.enum(EXPENSE_CATEGORIES);
export type ExpenseCategory = z.infer<typeof ExpenseCategoryEnum>;

export const SavingAllocationCategoryEnum = z.enum(SAVING_ALLOCATION_CATEGORIES);
export type SavingAllocationCategory = z.infer<typeof SavingAllocationCategoryEnum>;

export const InvestmentTypeEnum = z.enum(INVESTMENT_TYPES);
export type InvestmentType = z.infer<typeof InvestmentTypeEnum>;

export const FinancialGoalStatusEnum = z.enum(FINANCIAL_GOAL_STATUSES);
export type FinancialGoalStatus = z.infer<typeof FinancialGoalStatusEnum>;

export const FinanceCategoryEnum = z.union([
  IncomeCategoryEnum,
  ExpenseCategoryEnum,
  SavingAllocationCategoryEnum,
]);
export type FinanceCategory = z.infer<typeof FinanceCategoryEnum>;

export const FinanceEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: FinanceTypeEnum,
  amount: z.number().min(0.01),
  category: FinanceCategoryEnum,
  date: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  deletedAt: z.string().nullable().optional(),
});

export type FinanceEntry = z.infer<typeof FinanceEntrySchema>;

export const CreateFinanceEntrySchema = FinanceEntrySchema.omit({
  id: true,
  createdAt: true,
  deletedAt: true,
  userId: true,
});

export type CreateFinanceInput = z.infer<typeof CreateFinanceEntrySchema>;

export interface SavingAllocation {
  id: string;
  userId: string;
  category: SavingAllocationCategory;
  amount: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  status: FinancialGoalStatus;
  startedAt: string;
  deadlineAt?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface EmergencyFund {
  id: string;
  userId: string;
  currentAmount: number;
  targetAmount: number;
  savedAt: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface InvestmentOpportunity {
  id: string;
  userId: string;
  name: string;
  type: InvestmentType;
  amount: number;
  expectedReturn?: number;
  timeframeMonths?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  riskTolerance: "low" | "medium" | "high";
  preferredAssets: InvestmentType[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ProjectFinance {
  id: string;
  userId: string;
  name: string;
  budget: number;
  spent: number;
  status: "planning" | "active" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  month: string; // YYYY-MM
}

export const FINANCE_TYPE_LABELS: Record<FinanceType, string> = FINANCE_TYPE_LABELS_MAP;

export const CATEGORY_LABELS: Record<FinanceCategory, string> = {
  ...INCOME_CATEGORY_LABELS,
  ...EXPENSE_CATEGORY_LABELS,
  ...SAVING_ALLOCATION_LABELS,
};

export const INVESTMENT_TYPE_LABELS_MAP: Record<InvestmentType, string> = INVESTMENT_TYPE_LABELS;
