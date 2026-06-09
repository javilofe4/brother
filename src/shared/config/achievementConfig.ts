export const ACHIEVEMENT_CATEGORIES = [
  "training",
  "finance",
  "challenge",
  "consistency",
  "special",
] as const;
export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

export const AchievementCategoryLabels: Record<AchievementCategory, string> = {
  training: "Entrenamiento",
  finance: "Finanzas",
  challenge: "Retos",
  consistency: "Constancia",
  special: "Especial",
};

export const ACHIEVEMENT_RARITIES = ["common", "rare", "epic", "legendary"] as const;
export type AchievementRarity = (typeof ACHIEVEMENT_RARITIES)[number];
export const AchievementRarityLabels: Record<AchievementRarity, string> = {
  common: "Común",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
};

export const ACHIEVEMENT_STATUS = ["locked", "unlocked"] as const;
export type AchievementStatus = (typeof ACHIEVEMENT_STATUS)[number];

export const ACHIEVEMENT_THRESHOLDS: Record<AchievementCategory, string[]> = {
  training: ["Primer entrenamiento", "Racha de 7 días", "10 sesiones"],
  finance: ["Primer ahorro", "Ahorro mensual", "Meta de ahorro"],
  challenge: ["Primer reto", "Reto completado", "Duelo ganado"],
  consistency: ["Racha de 3 días", "Racha de 14 días", "Mes constante"],
  special: ["Evento especial", "Hito legendario", "Campeón del duelo"],
};
