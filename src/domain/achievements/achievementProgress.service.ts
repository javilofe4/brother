import type { UserId } from "@/domain/users/user.types";
import type { MetricSnapshot } from "@/domain/metrics/metric.types";
import type { AchievementProgress } from "./achievement.types";
import {
  evaluateAchievementsForUser,
  mergeAchievementProgress,
} from "./achievementEngine";

export function rebuildAchievementProgressForUsers(
  snapshots: MetricSnapshot[],
  userIds: UserId[],
  now = new Date()
): AchievementProgress[] {
  return userIds.flatMap((userId) =>
    evaluateAchievementsForUser(snapshots, [], userId, undefined, now).progress
  );
}

export function updateAchievementProgressForEvent(
  current: AchievementProgress[],
  snapshots: MetricSnapshot[],
  userId: UserId,
  eventId: string,
  now = new Date()
) {
  const previousForUser = current.filter((progress) => progress.userId === userId);
  const evaluated = evaluateAchievementsForUser(
    snapshots,
    previousForUser,
    userId,
    eventId,
    now
  );
  return {
    achievementProgress: mergeAchievementProgress(current, evaluated.progress),
    unlocks: evaluated.unlocks,
  };
}
