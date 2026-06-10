import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { getLevelFromXp, LEVEL_THRESHOLDS } from "@/shared/config/xpConfig";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { RARITY_COLORS, RARITY_LABELS } from "@/domain/achievements/achievement.types";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/shared/components/ui";
import { PROGRESS_EVENT_ICONS, PROGRESS_EVENT_LABELS } from "@/domain/progress/progressEvent.types";

export function ProfilePage() {
  const navigate = useNavigate();
  const activeUserId = useAppStore((s) => s.activeUserId);
  const events = useAppStore((s) => s.progressEvents);
  const getUserTotalXp = useAppStore((s) => s.getUserTotalXp);
  const getUserAchievementProgress = useAppStore((s) => s.getUserAchievementProgress);
  const getStreak = useAppStore((s) => s.getStreak);

  const user = USERS[activeUserId];
  const totalXp = getUserTotalXp(activeUserId);
  const { level, levelConfig, progress, xpToNext } = getLevelFromXp(totalXp);
  const streak = getStreak(activeUserId);
  const allProgress = getUserAchievementProgress(activeUserId);
  const userEvents = events.filter((e) => e.userId === activeUserId);

  // Stats
  const totalSessions = userEvents.length;
  const unlockedCount = allProgress.filter((p) => p.currentLevel > 0).length;
  const maxedCount = allProgress.filter((p) => {
    const s = ACHIEVEMENT_CATALOG.find((x) => x.id === p.seriesId);
    return s && p.currentLevel >= s.levels.length;
  }).length;
  const totalXpFromAchievements = allProgress.reduce(
    (sum, p) => sum + p.totalXpEarned,
    0
  );

  // Unlocked achievements (non-zero level)
  const unlockedAchievements = allProgress
    .filter((p) => p.currentLevel > 0)
    .map((p) => ({
      prog: p,
      series: ACHIEVEMENT_CATALOG.find((s) => s.id === p.seriesId)!,
    }))
    .filter((x) => x.series)
    .sort((a, b) => b.prog.currentLevel - a.prog.currentLevel);

  // Session type breakdown
  const sessionBreakdown = Object.entries(
    userEvents.reduce<Record<string, number>>((acc, e) => {
      acc[e.type] = (acc[e.type] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-6 animate-fade-in h-full overflow-y-auto">
      {/* Hero */}
      <Card className="mb-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${user.color}, transparent 70%)`,
          }}
        />
        <CardContent className="relative z-10 py-6">
          <div className="flex items-center gap-5">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl flex-shrink-0"
              style={{
                background: `${user.color}20`,
                border: `2px solid ${user.color}`,
                boxShadow: `0 0 30px ${user.color}40`,
              }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-4xl tracking-wide" style={{ color: user.color }}>
                {user.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">{levelConfig.icon}</span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: levelConfig.color }}
                >
                  {levelConfig.title}
                </span>
                <span className="text-text-muted">·</span>
                <span className="font-mono text-sm" style={{ color: user.color }}>
                  {totalXp.toLocaleString()} XP
                </span>
              </div>
              {/* Level bar */}
              <div className="mt-2 max-w-xs">
                <Progress value={progress} color={levelConfig.color} />
                {xpToNext > 0 && (
                  <p className="text-[10px] text-text-muted mt-1">
                    {xpToNext} XP para Nivel {level + 1}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {[
              { label: "XP Total", value: totalXp.toLocaleString(), color: user.color },
              { label: "Racha", value: `${streak}d`, color: "#f59e0b" },
              { label: "Sesiones", value: totalSessions, color: "#10b981" },
              { label: "Logros", value: unlockedCount, color: "#7c3aed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Level ladder */}
      <h2 className="text-xs uppercase tracking-widest text-text-muted mb-3">
        Progresión de niveles
      </h2>
      <Card className="mb-5">
        <CardContent className="py-3">
          <div className="space-y-2">
            {LEVEL_THRESHOLDS.map((threshold, i) => {
              const isCurrentOrPast = totalXp >= threshold.minXp;
              const isCurrent = level === i + 1;
              return (
                <div key={threshold.name} className="flex items-center gap-3">
                  <span
                    className="text-lg w-7 text-center flex-shrink-0"
                    style={{ opacity: isCurrentOrPast ? 1 : 0.3 }}
                  >
                    {threshold.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isCurrentOrPast ? threshold.color : "#444466" }}
                      >
                        {threshold.name}
                      </span>
                      <span className="text-xs text-text-muted font-mono">
                        {threshold.minXp.toLocaleString()} XP
                      </span>
                    </div>
                    {isCurrent && (
                      <Progress
                        value={progress}
                        color={threshold.color}
                        className="mt-1 h-1"
                      />
                    )}
                  </div>
                  {isCurrent && (
                    <Badge
                      style={{ background: `${threshold.color}20`, color: threshold.color, fontSize: "9px" }}
                    >
                      ACTUAL
                    </Badge>
                  )}
                  {!isCurrent && isCurrentOrPast && (
                    <span className="text-accent-emerald text-sm">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-5">
        {/* Unlocked achievements */}
        <Card>
          <CardHeader>
            <CardTitle>
              Logros ({unlockedCount}/{ACHIEVEMENT_CATALOG.length})
              {maxedCount > 0 && (
                <span className="ml-2 text-accent-amber text-xs">
                  👑 {maxedCount} maestrías
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unlockedAchievements.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">
                Registra sesiones para desbloquear logros
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {unlockedAchievements.map(({ prog, series }) => {
                  const levelDef = series.levels.find((level) => level.level === prog.currentLevel);
                  const color = RARITY_COLORS[levelDef?.rarity ?? "common"];
                  const isMaxed = prog.currentLevel >= series.levels.length;
                  return (
                    <button
                      key={series.id}
                      onClick={() => navigate(`/achievements/${series.id}`)}
                      className="flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all hover:scale-105"
                      style={{
                        borderColor: `${color}44`,
                        background: `${color}10`,
                      }}
                    >
                      <span className="text-2xl">
                        {isMaxed ? "🏆" : series.icon}
                      </span>
                      <span className="text-[10px] font-medium text-text-primary leading-tight">
                        {series.name}
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-wide"
                        style={{ color }}
                      >
                        {levelDef?.label}
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
          <CardHeader>
            <CardTitle>Sesiones por tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionBreakdown.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">Sin sesiones</p>
            ) : (
              <div className="space-y-2.5">
                {sessionBreakdown.slice(0, 6).map(([type, count]) => {
                  const maxCount = sessionBreakdown[0][1];
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">
                            {PROGRESS_EVENT_ICONS[type as keyof typeof PROGRESS_EVENT_ICONS] ?? "🎯"}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {PROGRESS_EVENT_LABELS[type as keyof typeof PROGRESS_EVENT_LABELS] ?? type}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-text-primary">
                          {count}
                        </span>
                      </div>
                      <Progress
                        value={(count / maxCount) * 100}
                        color={user.color}
                        className="h-1"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent events */}
      <h2 className="text-xs uppercase tracking-widest text-text-muted mb-3">
        Historial
      </h2>
      <div className="space-y-2">
        {userEvents.slice(0, 10).map((evt) => (
          <Card key={evt.id} className="flex items-center gap-3 hover:border-bg-border/60 transition-colors">
            <CardContent className="flex items-center gap-3 w-full py-2.5">
              <span className="text-lg flex-shrink-0">
                {PROGRESS_EVENT_ICONS[evt.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {PROGRESS_EVENT_LABELS[evt.type]}
                </p>
                <p className="text-xs text-text-muted">
                  {format(new Date(evt.occurredAt), "d 'de' MMM, HH:mm", { locale: es })}
                </p>
              </div>
              <Badge variant="default">+{evt.xpFromActivity} XP</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
