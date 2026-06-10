import { getDb } from "../client";
import type { XpLedgerEntry } from "@/domain/xp/xpLedger.types";

export const xpLedgerRepository = {
  async insertMany(entries: XpLedgerEntry[]): Promise<void> {
    const db = await getDb();
    for (const entry of entries) {
      await db.execute(
        `INSERT OR IGNORE INTO xp_ledger
         (id, user_id, amount, source, reference_id, occurred_at, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.userId,
          entry.amount,
          entry.source,
          entry.referenceId,
          entry.occurredAt,
          entry.description,
        ]
      );
    }
  },
};
