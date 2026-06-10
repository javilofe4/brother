import type { ProgressEventType } from "@/domain/progress/progressEvent.types";
import type { AchievementRarity } from "@/domain/achievements/achievement.types";
import { LEVEL_CONFIG } from "@/domain/xp/levelConfig";
import { getLevelFromXp } from "@/domain/xp/levelSystem";
import { TEMPLATE_BY_ID } from "./sessionTemplatesConfig";

export interface XpConfig {
  baseXp: Record<ProgressEventType, number>;
  rarityMultipliers: Record<AchievementRarity, number>;
}

export const XP_CONFIG: XpConfig = {
  baseXp: Object.fromEntries(
    Object.values(TEMPLATE_BY_ID).map((template) => [template.id, template.baseXp])
  ) as Record<ProgressEventType, number>,
  rarityMultipliers: {
    common: 1,
    rare: 1.5,
    epic: 2.5,
    legendary: 5,
  },
};

export const LEVEL_THRESHOLDS = LEVEL_CONFIG.map((level) => ({
  name: level.title,
  minXp: level.requiredTotalXp,
  color: level.color,
  icon: level.icon,
}));

export function calculateEventXp(eventType: ProgressEventType): number {
  return XP_CONFIG.baseXp[eventType] ?? 0;
}

export { getLevelFromXp };
