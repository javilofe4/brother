import { getDb } from "../client";
import type { AchievementProgress } from "@/domain/achievements/achievement.types";

export const achievementProgressRepository = {
  async upsertMany(progressRows: AchievementProgress[]): Promise<void> {
    const db = await getDb();
    for (const progress of progressRows) {
      await db.execute(
        `INSERT INTO achievement_progress
         (series_id, user_id, current_value, current_level, total_xp_earned, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(series_id, user_id) DO UPDATE SET
           current_value = excluded.current_value,
           current_level = excluded.current_level,
           total_xp_earned = excluded.total_xp_earned,
           updated_at = excluded.updated_at`,
        [
          progress.seriesId,
          progress.userId,
          progress.currentValue,
          progress.currentLevel,
          progress.totalXpEarned,
        ]
      );

      for (const unlock of progress.unlockedLevels) {
        await db.execute(
          `INSERT OR IGNORE INTO achievement_unlocked_levels
           (series_id, user_id, level, unlocked_at, event_id)
           VALUES (?, ?, ?, ?, ?)`,
          [
            progress.seriesId,
            progress.userId,
            unlock.level,
            unlock.unlockedAt,
            unlock.eventId,
          ]
        );
      }
    }
  },
};
