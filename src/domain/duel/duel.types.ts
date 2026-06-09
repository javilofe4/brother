import type { UserId } from "@/domain/users/user.types";

export interface DuelStat {
  userId: UserId;
  weeklyXp: number;
  monthlyXp: number;
  achievementsUnlocked: number;
  challengesWon: number;
  streak: number;
  workouts: number;
  savingsThisMonth: number;
}
