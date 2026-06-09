// src/db/repositories/finance.repository.ts

import { v4 as uuid } from "uuid";
import { getDb } from "../client";
import type { FinanceEntry, CreateFinanceInput } from "@/domain/finances/finance.types";
import type { UserId } from "@/domain/users/user.types";

export const financeRepository = {
  async findByUser(userId: UserId): Promise<FinanceEntry[]> {
    const db = await getDb();
    return db.select<FinanceEntry[]>(
      "SELECT * FROM finance_entries WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC",
      [userId]
    );
  },

  async findByMonth(userId: UserId, month: string): Promise<FinanceEntry[]> {
    const db = await getDb();
    return db.select<FinanceEntry[]>(
      "SELECT * FROM finance_entries WHERE user_id = ? AND date LIKE ? AND deleted_at IS NULL",
      [userId, `${month}%`]
    );
  },

  async create(userId: UserId, input: CreateFinanceInput): Promise<FinanceEntry> {
    const db = await getDb();
    const entry: FinanceEntry = {
      id: uuid(),
      userId,
      ...input,
      createdAt: new Date().toISOString(),
    };
    await db.execute(
      `INSERT INTO finance_entries (id, user_id, type, amount, category, date, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [entry.id, entry.userId, entry.type, entry.amount, entry.category, entry.date, entry.notes ?? null, entry.createdAt]
    );
    return entry;
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDb();
    await db.execute("UPDATE finance_entries SET deleted_at = ? WHERE id = ?", [
      new Date().toISOString(),
      id,
    ]);
  },
};
