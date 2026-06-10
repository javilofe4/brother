import { z } from "zod";

export const FinanceTypeEnum = z.enum(["income", "expense", "saving"]);
export type FinanceType = z.infer<typeof FinanceTypeEnum>;

export const FinanceCategoryEnum = z.enum([
  "salary",
  "freelance",
  "food",
  "transport",
  "housing",
  "entertainment",
  "health",
  "savings",
  "investment",
  "other",
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

export interface MonthlySummary {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  month: string; // YYYY-MM
}

export const FINANCE_TYPE_LABELS: Record<FinanceType, string> = {
  income: "Ingreso",
  expense: "Gasto",
  saving: "Ahorro",
};

export const CATEGORY_LABELS: Record<FinanceCategory, string> = {
  salary: "Salario",
  freelance: "Freelance",
  food: "Comida",
  transport: "Transporte",
  housing: "Vivienda",
  entertainment: "Ocio",
  health: "Salud",
  savings: "Ahorros",
  investment: "Inversión",
  other: "Otro",
};
