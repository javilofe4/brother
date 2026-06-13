import type { UserId } from "@/domain/users/user.types";
import type { MetricSnapshot } from "@/domain/metrics/metric.types";
import {
  ACHIEVEMENT_SERIES_CATALOG,
} from "./achievementSeriesCatalog";
import type {
  AchievementProgress,
  AchievementSeries,
  AchievementUnlock,
  AchievementUnlockedLevel,
} from "./achievement.types";

function getSnapshotValue(
  snapshots: MetricSnapshot[],
  userId: UserId,
  metricId: string
): number {
  return snapshots.find((snapshot) => snapshot.userId === userId && snapshot.metricId === metricId)?.value ?? 0;
}

function getCurrentLevel(series: AchievementSeries, value: number): number {
  return series.levels.reduce(
    (current, level) => (value >= level.threshold ? level.level : current),
    0
  );
}

export function evaluateAchievementSeries(
  series: AchievementSeries,
  snapshots: MetricSnapshot[],
  previous: AchievementProgress | undefined,
  userId: UserId,
  eventId: string | undefined,
  now = new Date()
): { progress: AchievementProgress; unlocks: AchievementUnlock[] } {
  const value = getSnapshotValue(snapshots, userId, series.dependsOnMetric);
  const currentLevel = getCurrentLevel(series, value);
  const previousUnlocked = previous?.unlockedLevels ?? [];
  const previousUnlockedSet = new Set(previousUnlocked.map((unlock) => unlock.level));
  const nextUnlocked: AchievementUnlockedLevel[] = [...previousUnlocked];
  const unlocks: AchievementUnlock[] = [];

  for (const level of series.levels) {
    if (value < level.threshold || previousUnlockedSet.has(level.level)) continue;
    const unlocked = {
      level: level.level,
      unlockedAt: now.toISOString(),
      eventId: eventId ?? "seed",
    };
    nextUnlocked.push(unlocked);
  }

  const totalXpEarned = series.levels
    .filter((level) => nextUnlocked.some((unlock) => unlock.level === level.level))
    .reduce((sum, level) => sum + level.xpReward, 0);

  const progress: AchievementProgress = {
    seriesId: series.id,
    userId,
    currentValue: value,
    currentLevel,
    totalXpEarned,
    unlockedLevels: nextUnlocked.sort((a, b) => a.level - b.level),
  };

  for (const unlocked of nextUnlocked) {
    if (previousUnlockedSet.has(unlocked.level)) continue;
    const level = series.levels.find((candidate) => candidate.level === unlocked.level);
    if (level) unlocks.push({ series, level, progress });
  }

  return { progress, unlocks };
}

export function evaluateAchievementsForUser(
  snapshots: MetricSnapshot[],
  previousProgress: AchievementProgress[],
  userId: UserId,
  eventId?: string,
  now = new Date()
): { progress: AchievementProgress[]; unlocks: AchievementUnlock[] } {
  const previousBySeries = new Map(previousProgress.map((progress) => [progress.seriesId, progress]));
  const results = ACHIEVEMENT_SERIES_CATALOG.map((series) =>
    evaluateAchievementSeries(
      series,
      snapshots,
      previousBySeries.get(series.id),
      userId,
      eventId,
      now
    )
  );

  return {
    progress: results.map((result) => result.progress),
    unlocks: results.flatMap((result) => result.unlocks),
  };
}

export function buildAchievementProgress(
  snapshots: MetricSnapshot[],
  userId: UserId,
  now = new Date()
): AchievementProgress[] {
  return evaluateAchievementsForUser(snapshots, [], userId, undefined, now).progress;
}

export function mergeAchievementProgress(
  current: AchievementProgress[],
  nextForUser: AchievementProgress[]
): AchievementProgress[] {
  const keys = new Set(nextForUser.map((progress) => `${progress.userId}:${progress.seriesId}`));
  return [
    ...current.filter((progress) => !keys.has(`${progress.userId}:${progress.seriesId}`)),
    ...nextForUser,
  ];
}
