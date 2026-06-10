import type { UserId } from "@/domain/users/user.types";

export type XpLedgerSource =
  | "activity"
  | "achievement_unlock"
  | "streak_bonus"
  | "challenge_win"
  | "manual_adjustment";

export interface XpLedgerEntry {
  id: string;
  userId: UserId;
  amount: number;
  source: XpLedgerSource;
  referenceId: string;
  occurredAt: string;
  description: string;
}
