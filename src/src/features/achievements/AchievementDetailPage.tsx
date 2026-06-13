import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { ACHIEVEMENT_BY_ID } from "@/domain/achievements/achievementCatalog";
import { RARITY_COLORS, RARITY_LABELS } from "@/domain/achievements/achievement.types";
import { getSeriesProgressPercent } from "@/domain/achievements/achievement.types";
import { PROGRESS_EVENT_ICONS, PROGRESS_EVENT_LABELS } from "@/domain/progress/progressEvent.types";
import { Button, Progress, Badge, cn } from "@/shared/components/ui";

export function AchievementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeUserId = useAppStore((s) => s.activeUserId);
  const getUserAchievementProgress = useAppStore((s) => s.getUserAchievementProgress);
  const getUserEvents = useAppStore((s) => s.getUserEvents);

  const series = id ? ACHIEVEMENT_BY_ID[id] : null;
  if (!series) {
    return (
      <div className="p-6 text-center">
        <p className="text-[var(--text-muted)]">Logro no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate("/achievements")} className="mt-4">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  const allProgress = getUserAchievementProgress(activeUserId);
  const prog = allProgress.find((p) => p.seriesId === series.id);
  const currentLevel = prog?.currentLevel ?? 0;
  const currentValue = prog?.currentValue ?? 0;
  const isMaxed = currentLevel >= series.levels.length;
  const pct = getSeriesProgressPercent(series, prog);
  const nextLevelDef = series.levels.find((l) => l.level > currentLevel) ?? null;
  const accentColor = nextLevelDef ? RARITY_COLORS[nextLevelDef.rarity] : RARITY_COLORS.legendary;

  // Related events — series.dependsOnMetric tells us the metric, but we can filter by
  // checking if the event type matches any template that feeds this metric indirectly.
  // Simplest heuristic: match by relatedTemplateId if set.
  const relatedTemplateId = series.relatedTemplateId;
  const relatedEvents = getUserEvents(activeUserId)
    .filter((e) => !relatedTemplateId || e.type === relatedTemplateId)
    .slice(0, 6);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-lg mx-auto px-6 py-6 animate-fade-in">
        {/* Back */}
        <button
          onClick={() => navigate("/achievements")}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-5"
        >
          <ArrowLeft className="h-4 w-4" /> Todos los logros
        </button>

        {/* Hero */}
        <div
          className="rounded-2xl border p-6 text-center mb-5 bg-[var(--bg-surface)] shadow-card"
          style={{ borderColor: isMaxed ? "var(--gold)" : `${accentColor}44` }}
        >
          <div className="text-5xl mb-2">{series.icon}</div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">{series.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">{series.description}</p>

          {/* Level pips */}
          <div className="flex justify-center gap-2 mt-4 mb-3">
            {series.levels.map((l) => (
              <div key={l.level} className="text-center">
                <div
                  className="h-1.5 w-12 rounded-full"
                  style={{
                    background: currentLevel >= l.level
                      ? RARITY_COLORS[l.rarity]
                      : "var(--bg-elevated)",
                  }}
                />
                <p className="text-[9px] mt-1 text-[var(--text-muted)]">{l.label}</p>
              </div>
            ))}
          </div>

          {!isMaxed && nextLevelDef && (
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                <span>{currentValue} / {nextLevelDef.threshold}</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <Progress value={pct} color={accentColor} />
              <p className="text-xs text-[var(--text-muted)] mt-1.5">
                Siguiente: <span style={{ color: accentColor }}>{nextLevelDef.label}</span>
                {" · "}+{nextLevelDef.xpReward} XP
              </p>
            </div>
          )}
          {isMaxed && <Badge variant="gold" className="mt-3">👑 Completado</Badge>}
        </div>

        {/* Levels */}
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Niveles</h2>
        <div className="space-y-2 mb-5">
          {series.levels.map((l) => {
            const unlocked = currentLevel >= l.level;
            const unlockInfo = prog?.unlockedLevels.find((u) => u.level === l.level);
            return (
              <div
                key={l.level}
                className={cn(
                  "rounded-xl border p-3 flex items-center gap-3 bg-[var(--bg-surface)] shadow-card",
                  !unlocked && "opacity-60"
                )}
                style={unlocked ? { borderColor: `${RARITY_COLORS[l.rarity]}44` } : {}}
              >
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: unlocked ? `${RARITY_COLORS[l.rarity]}15` : "var(--bg-elevated)" }}
                >
                  {unlocked ? (l.rewardType === "trophy" ? "🏆" : l.rewardType === "badge" ? "🎖️" : "⭐") : <Lock className="h-4 w-4 text-[var(--text-muted)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{l.label}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{
                        background: `${RARITY_COLORS[l.rarity]}18`,
                        color: RARITY_COLORS[l.rarity],
                      }}
                    >
                      {RARITY_LABELS[l.rarity]}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{l.description}</p>
                  {unlockInfo && (
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      Desbloqueado el {format(new Date(unlockInfo.unlockedAt), "d MMM yyyy", { locale: es })}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-sm font-bold font-mono"
                    style={{ color: unlocked ? RARITY_COLORS[l.rarity] : "var(--text-muted)" }}
                  >
                    +{l.xpReward} XP
                  </p>
                  {unlocked && <CheckCircle2 className="h-4 w-4 text-[var(--emerald)] ml-auto mt-1" />}
                </div>
              </div>
            );
          })}
        </div>

        <Button className="w-full mb-5" onClick={() => navigate("/register")}>
          Registrar sesión relacionada
        </Button>

        {relatedEvents.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Historial de sesiones
            </h2>
            <div className="space-y-2">
              {relatedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-3 shadow-card flex items-center gap-3"
                >
                  <span className="text-lg">{PROGRESS_EVENT_ICONS[evt.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {PROGRESS_EVENT_LABELS[evt.type] ?? evt.type}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {format(new Date(evt.occurredAt), "d MMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--emerald)]">
                    +{evt.xpFromActivity} XP
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
