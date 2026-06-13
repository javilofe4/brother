import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { RARITY_COLORS } from "@/domain/achievements/achievement.types";
import { getSeriesProgressPercent, getSeriesNextLevel, getSeriesCurrentLevel } from "@/domain/achievements/achievement.types";
import type { AchievementCategory } from "@/domain/progress/progressEvent.types";
import { CATEGORY_LABELS } from "@/domain/progress/progressEvent.types";
import { Progress, cn } from "@/shared/components/ui";

// "conditions" is the real category from the existing types, not "special"
const CATEGORIES: AchievementCategory[] = [
  "all", "combat", "strength", "endurance", "finance", "challenges", "constancy", "conditions",
];
const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  all: "🎮",
  combat: "🥊",
  strength: "🏋️",
  endurance: "🏃",
  finance: "💰",
  challenges: "⚔️",
  constancy: "📅",
  conditions: "🌡️",
};

export function AchievementsPage() {
  const [filter, setFilter] = useState<AchievementCategory>("all");
  const navigate = useNavigate();
  const activeUserId = useAppStore((s) => s.activeUserId);
  const getUserAchievementProgress = useAppStore((s) => s.getUserAchievementProgress);
  const allProgress = getUserAchievementProgress(activeUserId);

  const filtered = ACHIEVEMENT_CATALOG.filter((s) => filter === "all" || s.category === filter);
  const totalUnlocked = allProgress.filter((p) => p.currentLevel > 0).length;
  const totalMaxed = allProgress.filter((p) => {
    const s = ACHIEVEMENT_CATALOG.find((x) => x.id === p.seriesId);
    return s && p.currentLevel >= s.levels.length;
  }).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-6 animate-fade-in">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Logros</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {totalUnlocked}/{ACHIEVEMENT_CATALOG.length} series iniciadas
            {totalMaxed > 0 && ` · ${totalMaxed} completadas`}
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-150",
                filter === cat
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--bg-border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
            >
              {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Achievement grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((series) => {
            const prog = allProgress.find((p) => p.seriesId === series.id);
            const currentLevel = prog?.currentLevel ?? 0;
            const maxLevel = series.levels.length;
            const isMaxed = currentLevel >= maxLevel;
            const pct = getSeriesProgressPercent(series, prog);
            const nextLevel = getSeriesNextLevel(series, prog);
            const currentLevelDef = getSeriesCurrentLevel(series, prog);
            const unlocked = currentLevel > 0;
            const accentColor = nextLevel
              ? RARITY_COLORS[nextLevel.rarity]
              : RARITY_COLORS.legendary;

            return (
              <button
                key={series.id}
                onClick={() => navigate(`/achievements/${series.id}`)}
                className={cn(
                  "rounded-xl border p-3 text-left bg-[var(--bg-surface)] shadow-card",
                  "transition-all duration-150 hover:shadow-card-md hover:-translate-y-0.5",
                  isMaxed ? "border-[var(--gold)]" : "border-[var(--bg-border)]"
                )}
                style={isMaxed ? { boxShadow: `0 0 0 1px var(--gold), 0 4px 12px 0 rgb(0 0 0 / 0.08)` } : {}}
              >
                {/* Icon */}
                <div className="text-3xl mb-2 text-center">
                  {isMaxed ? "🏆" : unlocked ? series.icon : "🔒"}
                </div>

                {/* Level pips */}
                <div className="flex gap-0.5 mb-2">
                  {series.levels.map((l) => (
                    <div
                      key={l.level}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        background: currentLevel >= l.level
                          ? RARITY_COLORS[l.rarity]
                          : "var(--bg-elevated)",
                      }}
                    />
                  ))}
                </div>

                {/* Name */}
                <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight mb-0.5 text-center">
                  {series.name}
                </p>

                {/* Status */}
                {unlocked && !isMaxed ? (
                  <p className="text-[10px] text-center font-medium" style={{ color: accentColor }}>
                    {currentLevelDef?.label}
                  </p>
                ) : isMaxed ? (
                  <p className="text-[10px] text-center font-medium text-[var(--gold)]">Completado 🏆</p>
                ) : (
                  <p className="text-[10px] text-center text-[var(--text-muted)]">Sin empezar</p>
                )}

                {/* Progress bar */}
                {!isMaxed && (
                  <div className="mt-2">
                    <Progress value={pct} color={accentColor} thin />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
