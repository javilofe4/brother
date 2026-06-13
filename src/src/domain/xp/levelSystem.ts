import { LEVEL_CONFIG, type LevelDefinition } from "./levelConfig";

export interface LevelState {
  level: number;
  levelConfig: LevelDefinition;
  progress: number;
  xpToNext: number;
}

export function getLevelFromXp(totalXp: number): LevelState {
  const current = [...LEVEL_CONFIG]
    .reverse()
    .find((level) => totalXp >= level.requiredTotalXp) ?? LEVEL_CONFIG[0];
  const next = LEVEL_CONFIG.find((level) => level.level === current.level + 1);
  if (!next) {
    return {
      level: current.level,
      levelConfig: current,
      progress: 100,
      xpToNext: 0,
    };
  }

  const range = Math.max(next.requiredTotalXp - current.requiredTotalXp, 1);
  const earned = totalXp - current.requiredTotalXp;
  return {
    level: current.level,
    levelConfig: current,
    progress: Math.max(0, Math.min(100, Math.floor((earned / range) * 100))),
    xpToNext: Math.max(0, next.requiredTotalXp - totalXp),
  };
}
