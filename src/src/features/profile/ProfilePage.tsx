import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Flame } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { getLevelFromXp, LEVEL_THRESHOLDS } from "@/shared/config/xpConfig";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { RARITY_COLORS } from "@/domain/achievements/achievement.types";
import { getSeriesCurrentLevel } from "@/domain/achievements/achievement.types";
import { PROGRESS_EVENT_ICONS, PROGRESS_EVENT_LABELS } from "@/domain/progress/progressEvent.types";
import { Card, CardContent, CardHeader, CardTitle, Progress } from "@/shared/components/ui";

export function ProfilePage() {
  const navigate = useNavigate();
  const activeUserId = useAppStore((s) => s.activeUserId);
  const getUserTotalXp = useAppStore((s) => s.getUserTotalXp);
  const getUserAchievementProgress = useAppStore((s) => s.getUserAchievementProgress);
  const getStreak = useAppStore((s) => s.getStreak);
  const getUserEvents = useAppStore((s) => s.getUserEvents);

  const user = USERS[activeUserId];
  const totalXp = getUserTotalXp(activeUserId);
  const { level, levelConfig, progress, xpToNext } = getLevelFromXp(totalXp);
  const streak = getStreak(activeUserId);
  const allProgress = getUserAchievementProgress(activeUserId);
  const userEvents = getUserEvents(activeUserId);

  const unlockedCount = allProgress.filter((p) => p.currentLevel > 0).length;
  const maxedCount = allProgress.filter((p) => {
    const s = ACHIEVEMENT_CATALOG.find((x) => x.id === p.seriesId);
    return s && p.currentLevel >= s.levels.length;
  }).length;

  const unlockedAchievements = allProgress
    .filter((p) => p.currentLevel > 0)
    .map((p) => ({
      prog: p,
      series: ACHIEVEMENT_CATALOG.find((s) => s.id === p.seriesId)!,
    }))
    .filter((x) => x.series)
    .sort((a, b) => b.prog.currentLevel - a.prog.currentLevel);

  const sessionBreakdown = Object.entries(
    userEvents.reduce<Record<string, number>>((acc, e) => {
      acc[e.type] = (acc[e.type] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-6 animate-fade-in space-y-5">
        {/* Hero */}
        <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 shadow-card">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${user.color}15`, border: `2px solid ${user.color}30` }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user.name}</h1>
              <p className="text-sm mt-0.5" style={{ color: levelConfig.color }}>
                {levelConfig.icon} {levelConfig.title} · Nivel {level}
              </p>
              <div className="mt-2">
                <Progress value={progress} color={user.color} thin />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {totalXp.toLocaleString()} XP
                  {xpToNext > 0 && ` · ${xpToNext} para nivel ${level + 1}`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { label: "XP", value: totalXp.toLocaleString(), color: user.color },
              { label: "Racha", value: `${streak}d`, color: "var(--gold)" },
              { label: "Sesiones", value: userEvents.length.toString(), color: "var(--emerald)" },
              { label: "Logros", value: unlockedCount.toString(), color: "var(--violet)" },
            ].map((stat) => (
              <div key={stat.label} className="text-center rounded-xl bg-[var(--bg-elevated)] py-2.5 px-2">
                <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Level ladder */}
        <Card>
          <CardHeader><CardTitle>Progresión</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {LEVEL_THRESHOLDS.map((t, i) => {
                const reached = totalXp >= t.minXp;
                const isCurrent = level === i + 1;
                return (
                  <div key={t.name} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center" style={{ opacity: reached ? 1 : 0.3 }}>{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium" style={{ color: reached ? t.color : "var(--text-muted)" }}>
                          {t.name}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{t.minXp.toLocaleString()} XP</span>
                      </div>
                      {isCurrent && <Progress value={progress} color={t.color} thin className="mt-1" />}
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: `${t.color}18`, color: t.color }}>
                        Actual
                      </span>
                    )}
                    {!isCurrent && reached && (
                      <span className="text-[var(--emerald)] text-sm">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Unlocked achievements */}
          <Card>
            <CardHeader>
              <CardTitle>
                Logros {unlockedCount}/{ACHIEVEMENT_CATALOG.length}
                {maxedCount > 0 && ` · ${maxedCount} completados`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unlockedAchievements.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">
                  Registra sesiones para desbloquear logros
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {unlockedAchievements.slice(0, 9).map(({ prog, series }) => {
                    const currentLevelDef = getSeriesCurrentLevel(series, prog);
                    const color = currentLevelDef ? RARITY_COLORS[currentLevelDef.rarity] : "var(--text-muted)";
                    const isMaxed = prog.currentLevel >= series.levels.length;
                    return (
                      <button
                        key={series.id}
                        onClick={() => navigate(`/achievements/${series.id}`)}
                        className="flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all hover:shadow-card-md hover:-translate-y-0.5"
                        style={{ borderColor: `${color}33`, background: `${color}08` }}
                      >
                        <span className="text-xl">{isMaxed ? "🏆" : series.icon}</span>
                        <span className="text-[9px] font-medium leading-tight text-[var(--text-primary)]">
                          {series.name}
                        </span>
                        <span className="text-[8px] uppercase tracking-wide" style={{ color }}>
                          {currentLevelDef?.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session breakdown */}
          <Card>
            <CardHeader><CardTitle>Por tipo</CardTitle></CardHeader>
            <CardContent>
              {sessionBreakdown.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">Sin sesiones</p>
              ) : (
                <div className="space-y-2.5">
                  {sessionBreakdown.slice(0, 6).map(([type, count]) => {
                    const maxCount = sessionBreakdown[0][1];
                    return (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{PROGRESS_EVENT_ICONS[type as keyof typeof PROGRESS_EVENT_ICONS] ?? "🎯"}</span>
                            <span className="text-xs text-[var(--text-secondary)]">
                              {PROGRESS_EVENT_LABELS[type as keyof typeof PROGRESS_EVENT_LABELS] ?? type}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{count}</span>
                        </div>
                        <Progress value={(count / maxCount) * 100} color={user.color} thin />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent events */}
        {userEvents.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Historial reciente</h2>
            <div className="space-y-2">
              {userEvents.slice(0, 8).map((evt) => (
                <div key={evt.id} className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-3 shadow-card flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">{PROGRESS_EVENT_ICONS[evt.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {PROGRESS_EVENT_LABELS[evt.type] ?? evt.type}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {format(new Date(evt.occurredAt), "d 'de' MMM, HH:mm", { locale: es })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--emerald)] flex-shrink-0">
                    +{evt.xpFromActivity} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
