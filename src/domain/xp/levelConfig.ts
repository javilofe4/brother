export interface LevelDefinition {
  level: number;
  requiredTotalXp: number;
  name: string;
  title: string;
  tierName: "Novato" | "Aspirante" | "Veterano" | "Maestro";
  color: string;
  icon: string;
}

function tierForLevel(level: number): LevelDefinition["tierName"] {
  if (level <= 5) return "Novato";
  if (level <= 10) return "Aspirante";
  if (level <= 20) return "Veterano";
  return "Maestro";
}

function colorForTier(tierName: LevelDefinition["tierName"]): string {
  return {
    Novato: "#8888aa",
    Aspirante: "#00e5ff",
    Veterano: "#7c3aed",
    Maestro: "#f59e0b",
  }[tierName];
}

function iconForTier(tierName: LevelDefinition["tierName"]): string {
  return {
    Novato: "I",
    Aspirante: "II",
    Veterano: "III",
    Maestro: "IV",
  }[tierName];
}

export const LEVEL_CONFIG: LevelDefinition[] = Array.from({ length: 30 }, (_, index) => {
  const level = index + 1;
  const tierName = tierForLevel(level);
  return {
    level,
    requiredTotalXp: Math.round(index * index * 75 + index * 125),
    name: `${tierName} ${level}`,
    title: `${tierName} ${level}`,
    tierName,
    color: colorForTier(tierName),
    icon: iconForTier(tierName),
  };
});
