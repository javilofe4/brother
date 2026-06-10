import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import {
  RARITY_COLORS,
  RARITY_LABELS,
  getSeriesCurrentLevel,
  getSeriesNextLevel,
  getSeriesProgressPercent,
} from "@/domain/achievements/achievement.types";
import {
  CATEGORY_LABELS,
  type AchievementCategory,
} from "@/domain/progress/progressEvent.types";
import { Card, CardContent, Badge, Progress, cn } from "@/shared/components/ui";

const FILTER_CATEGORIES: AchievementCategory[] = [
  "all",
  "combat",
  "strength",
  "endurance",
  "finance",
  "challenges",
  "constancy",
  "conditions",
];

const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  all: "🎮",
  combat: "🥊",
  strength: "🏋️",
  endurance: "🏃",
  finance: "💰",
  challenges: "⚔️",
  constancy: "📅",
  conditions: "🌦️",
};

export function AchievementsPage() {
  const [filter, setFilter] = useState<AchievementCategory>("all");
  const navigate = useNavigate();
  const activeUserId = useAppStore((state) => state.activeUserId);
  const allProgress = useAppStore((state) => state.getUserAchievementProgress(activeUserId));

  const filtered = ACHIEVEMENT_CATALOG.filter(
    (series) => filter === "all" || series.category === filter
  );
  const unlockedSeries = allProgress.filter((progress) => progress.currentLevel > 0).length;
  const maxedSeries = allProgress.filter((progress) => {
    const series = ACHIEVEMENT_CATALOG.find((item) => item.id === progress.seriesId);
    return Boolean(series && progress.currentLevel >= series.levels.length);
  }).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 animate-fade-in">
        <div className="mb-6">
          <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Coleccion</p>
          <h1 className="font-display text-4xl tracking-wide text-text-primary">Logros</h1>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              <span className="font-mono text-accent-cyan">{unlockedSeries}</span>/{ACHIEVEMENT_CATALOG.length} series
            </span>
            <span className="text-sm text-text-secondary">
              <span className="font-mono text-accent-amber">{maxedSeries}</span> completadas
            </span>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-1">
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                filter === category
                  ? "bg-accent-cyan text-bg-base"
                  : "border border-bg-border bg-bg-card text-text-secondary hover:text-text-primary"
              )}
            >
              <span>{CATEGORY_ICONS[category]}</span>
              <span>{CATEGORY_LABELS[category]}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((series) => {
            const progress = allProgress.find((item) => item.seriesId === series.id);
            const currentLevelNumber = progress?.currentLevel ?? 0;
            const currentLevel = getSeriesCurrentLevel(series, progress);
            const nextLevel = getSeriesNextLevel(series, progress);
            const progressPercent = getSeriesProgressPercent(series, progress);
            const isMaxed = !nextLevel;
            const rarityColor = RARITY_COLORS[nextLevel?.rarity ?? currentLevel?.rarity ?? series.rarity];

            return (
              <Card
                key={series.id}
                className="cursor-pointer hover:border-accent-cyan/50"
                onClick={() => navigate(`/achievements/${series.id}`)}
                style={currentLevelNumber > 0 ? { borderColor: `${rarityColor}55` } : {}}
              >
                <CardContent>
                  <div className="mb-3 flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl"
                      style={{ background: `${rarityColor}18` }}
                    >
                      {series.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-primary">{series.name}</p>
                      <p className="text-xs text-text-muted">{CATEGORY_LABELS[series.category]}</p>
                    </div>
                    <Badge variant={series.status === "active" ? "emerald" : "muted"}>
                      {series.status}
                    </Badge>
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      Nivel {currentLevelNumber}/{series.levels.length}
                    </span>
                    <span className="text-xs" style={{ color: rarityColor }}>
                      {currentLevel?.label ?? "Sin desbloquear"}
                    </span>
                  </div>

                  {!isMaxed && nextLevel ? (
                    <>
                      <div className="mb-1 flex justify-between text-[10px] text-text-muted">
                        <span>{progress?.currentValue ?? 0} / {nextLevel.threshold}</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} color={rarityColor} />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="muted">{nextLevel.label}</Badge>
                        <Badge style={{ background: `${rarityColor}18`, color: rarityColor }}>
                          {RARITY_LABELS[nextLevel.rarity]}
                        </Badge>
                        <Badge variant="amber">+{nextLevel.xpReward} XP</Badge>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-2 text-sm text-accent-amber">
                      Trofeo completado
                    </div>
                  )}

                  <p className="mt-3 text-[10px] text-text-muted">
                    Metrica: {series.dependsOnMetric}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
