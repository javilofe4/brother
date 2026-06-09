import { useMemo } from "react";
import { useAppStore } from "@/app/store";
import {
  getLockedAchievements,
  getUnlockedAchievements,
  getLatestUnlockedAchievements,
} from "@/domain/achievements/achievement.service";
import type { Achievement } from "@/domain/achievements/achievement.types";
import type { UserAchievement } from "@/domain/achievements/achievement.types";
import { ACHIEVEMENT_CATEGORIES } from "@/shared/config/achievementConfig";

export function useAchievements() {
  const achievements = useAppStore((s) => s.achievements);
  const userAchievements = useAppStore((s) => s.userAchievements);

  return useMemo(() => {
    const unlocked = getUnlockedAchievements(achievements, userAchievements);
    const locked = getLockedAchievements(achievements, userAchievements);
    const achievementById = new Map(achievements.map((item) => [item.id, item]));

    const unlockedDetails = userAchievements
      .filter((ua) => ua.status === "unlocked")
      .map((ua) => ({
        achievement: achievementById.get(ua.achievementId) as Achievement,
        userAchievement: ua,
      }))
      .filter((item) => Boolean(item.achievement));

    const lockedDetails = locked.map((achievement) => {
      const existing = userAchievements.find((ua) => ua.achievementId === achievement.id);
      return {
        achievement,
        userAchievement: existing ?? {
          id: `${achievement.id}-locked`,
          achievementId: achievement.id,
          userId: "javier",
          status: "locked" as const,
          progressCurrent: 0,
          progressTarget: 100,
          progress: 0,
          unlockedAt: null,
          createdAt: achievement.createdAt,
        },
      };
    });

    return {
      unlocked,
      locked,
      categories: ACHIEVEMENT_CATEGORIES,
      recentUnlocked: getLatestUnlockedAchievements(achievements, userAchievements),
      total: achievements.length,
      completed: userAchievements.filter((ua) => ua.status === "unlocked").length,
      unlockedDetails,
      lockedDetails,
    };
  }, [achievements, userAchievements]);
}
