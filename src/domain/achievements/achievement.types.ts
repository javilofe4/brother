import type { UserId } from "@/domain/users/user.types";
import type { AchievementCategory } from "@/domain/progress/progressEvent.types";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";
export type RewardType = "star" | "badge" | "trophy";
export type AchievementOrigin = "system" | "user";
export type AchievementStatus = "active" | "archived";

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: "#8888aa",
  rare: "#00e5ff",
  epic: "#7c3aed",
  legendary: "#f59e0b",
};

export const RARITY_LABELS: Record<AchievementRarity, string> = {
  common: "Comun",
  rare: "Raro",
  epic: "Epico",
  legendary: "Legendario",
};

export interface AchievementLevel {
  level: number;
  label: string;
  description: string;
  threshold: number;
  xpReward: number;
  rarity: AchievementRarity;
  rewardType: RewardType;
}

export interface AchievementSeries {
  id: string;
  name: string;
  description: string;
  category: Exclude<AchievementCategory, "all">;
  icon: string;
  rarity: AchievementRarity;
  dependsOnMetric: string;
  levels: AchievementLevel[];
  origin: AchievementOrigin;
  status: AchievementStatus;
  isHidden: boolean;
  createdAt?: string;
  createdByUserId?: UserId;
  requiresMutualApproval: boolean;
  relatedTemplateId?: string;
}

export interface AchievementUnlockedLevel {
  level: number;
  unlockedAt: string;
  eventId: string;
}

export interface AchievementProgress {
  seriesId: string;
  userId: UserId;
  currentValue: number;
  currentLevel: number;
  totalXpEarned: number;
  unlockedLevels: AchievementUnlockedLevel[];
}

export type UserAchievementProgress = AchievementProgress;

export interface AchievementUnlock {
  series: AchievementSeries;
  level: AchievementLevel;
  progress: AchievementProgress;
}

export function getSeriesNextLevel(
  series: AchievementSeries,
  progress: AchievementProgress | undefined
): AchievementLevel | null {
  const currentLevel = progress?.currentLevel ?? 0;
  return series.levels.find((level) => level.level > currentLevel) ?? null;
}

export function getSeriesCurrentLevel(
  series: AchievementSeries,
  progress: AchievementProgress | undefined
): AchievementLevel | null {
  const currentLevel = progress?.currentLevel ?? 0;
  if (currentLevel === 0) return null;
  return [...series.levels].reverse().find((level) => level.level <= currentLevel) ?? null;
}

export function getSeriesProgressPercent(
  series: AchievementSeries,
  progress: AchievementProgress | undefined
): number {
  const next = getSeriesNextLevel(series, progress);
  if (!next) return 100;
  const currentLevel = progress?.currentLevel ?? 0;
  const previous = [...series.levels]
    .reverse()
    .find((level) => level.level <= currentLevel);
  const previousThreshold = previous?.threshold ?? 0;
  const value = progress?.currentValue ?? 0;
  const range = Math.max(next.threshold - previousThreshold, 1);
  return Math.max(0, Math.min(100, ((value - previousThreshold) / range) * 100));
}
