import { z } from "zod";
import {
  AchievementCategoryLabels,
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_RARITIES,
  ACHIEVEMENT_STATUS,
} from "@/shared/config/achievementConfig";
import type { UserId } from "@/domain/users/user.types";

export const AchievementCategoryEnum = z.enum(ACHIEVEMENT_CATEGORIES);
export type AchievementCategory = z.infer<typeof AchievementCategoryEnum>;

export const AchievementRarityEnum = z.enum(ACHIEVEMENT_RARITIES);
export type AchievementRarity = z.infer<typeof AchievementRarityEnum>;

export const AchievementStatusEnum = z.enum(ACHIEVEMENT_STATUS);
export type AchievementStatus = z.infer<typeof AchievementStatusEnum>;

export const ACHIEVEMENT_LABELS: Record<AchievementCategory, string> = AchievementCategoryLabels;

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(250),
  category: AchievementCategoryEnum,
  rarity: AchievementRarityEnum,
  xpReward: z.number().min(0),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export type Achievement = z.infer<typeof AchievementSchema>;

export const UserAchievementSchema = z.object({
  id: z.string(),
  achievementId: z.string(),
  userId: z.string() as z.ZodType<UserId>,
  status: AchievementStatusEnum,
  progressCurrent: z.number().min(0),
  progressTarget: z.number().min(0),
  progress: z.number().min(0).max(100),
  unlockedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export type UserAchievement = z.infer<typeof UserAchievementSchema>;
