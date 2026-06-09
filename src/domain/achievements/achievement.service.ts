import type { Achievement, UserAchievement } from "./achievement.types";

export function getUnlockedAchievements(
  achievements: Achievement[],
  userAchievements: UserAchievement[]
) {
  const unlockedIds = new Set(
    userAchievements.filter((ua) => ua.status === "unlocked").map((ua) => ua.achievementId)
  );
  return achievements.filter((achievement) => unlockedIds.has(achievement.id));
}

export function getLockedAchievements(
  achievements: Achievement[],
  userAchievements: UserAchievement[]
) {
  const unlockedIds = new Set(
    userAchievements.filter((ua) => ua.status === "unlocked").map((ua) => ua.achievementId)
  );
  return achievements.filter((achievement) => !unlockedIds.has(achievement.id));
}

export function getAchievementProgress(
  userAchievement: UserAchievement
) {
  return Math.min(100, Math.max(0, userAchievement.progress));
}

export function getLatestUnlockedAchievements(
  achievements: Achievement[],
  userAchievements: UserAchievement[],
  limit = 3
) {
  const unlocked = getUnlockedAchievements(achievements, userAchievements);
  const unlockedMap = new Map(unlocked.map((item) => [item.id, item]));

  return userAchievements
    .filter((ua) => ua.status === "unlocked")
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, limit)
    .map((ua) => ({
      ...ua,
      achievement: unlockedMap.get(ua.achievementId),
    }))
    .filter((item): item is UserAchievement & { achievement: Achievement } => Boolean(item.achievement));
}
