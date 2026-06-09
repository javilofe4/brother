import { z } from "zod";
import {
  FinanceTypeEnum,
  FinanceCategoryEnum,
  FinancialGoalStatusEnum,
  InvestmentTypeEnum,
} from "./finance.types";

export const financeEntrySchema = z.object({
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

export const financialGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(3).max(80),
  description: z.string().optional(),
  targetAmount: z.number().min(0),
  currentAmount: z.number().min(0),
  currency: z.string().default("EUR"),
  status: FinancialGoalStatusEnum,
  startedAt: z.string(),
  deadlineAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export const emergencyFundSchema = z.object({
  id: z.string(),
  userId: z.string(),
  currentAmount: z.number().min(0),
  targetAmount: z.number().min(0),
  savedAt: z.string(),
  note: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export const investmentOpportunitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(2).max(100),
  type: InvestmentTypeEnum,
  amount: z.number().min(0),
  expectedReturn: z.number().min(0).optional(),
  timeframeMonths: z.number().min(0).optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export const investorProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  riskTolerance: z.enum(["low", "medium", "high"]),
  preferredAssets: z.array(InvestmentTypeEnum),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export const projectFinanceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(3).max(100),
  budget: z.number().min(0),
  spent: z.number().min(0),
  status: z.enum(["planning", "active", "completed"]),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});
