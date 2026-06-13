import { useNavigate } from "react-router-dom";
import { PlusCircle, Flame, Trophy, Swords, ChevronRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { getLevelFromXp } from "@/shared/config/xpConfig";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { getSeriesNextLevel, getSeriesProgressPercent } from "@/domain/achievements/achievement.types";
import { PROGRESS_EVENT_LABELS, PROGRESS_EVENT_ICONS } from "@/domain/progress/progressEvent.types";
import { Card, CardContent, Badge, Progress, Button } from "@/shared/components/ui";
import {
  buildMissionInstances,
  currentMonthKey,
  computeUserMissionProgress,
  completedMissionCount,
  getMissionsForMonth,
} from "@/domain/monthlyMissions/monthlyMission.service";
import { cn } from "@/shared/components/ui";

export function DashboardPage() {
  const navigate = useNavigate();
  const activeUserId = useAppStore((s) => s.activeUserId);
  const getUserTotalXp = useAppStore((s) => s.getUserTotalXp);
  const getUserAchievementProgress = useAppStore((s) => s.getUserAchievementProgress);
  const getUserMetricValue = useAppStore((s) => s.getUserMetricValue);
  const getStreak = useAppStore((s) => s.getStreak);
  const getUserEvents = useAppStore((s) => s.getUserEvents);
  const challenges = useAppStore((s) => s.challenges);

  const user = USERS[activeUserId];
  const rivalId = activeUserId === "javier" ? "rival" : "javier";
  const myXp = getUserTotalXp(activeUserId);
  const { level, levelConfig, progress, xpToNext } = getLevelFromXp(myXp);
  const streak = getStreak(activeUserId);
  const myProgress = getUserAchievementProgress(activeUserId);
  const recentEvents = getUserEvents(activeUserId).slice(0, 3);

  // Near-complete achievements
  const nearComplete = ACHIEVEMENT_CATALOG
    .map((series) => {
      const prog = myProgress.find((p) => p.seriesId === series.id);
      const next = getSeriesNextLevel(series, prog);
      if (!next) return null;
      const pct = getSeriesProgressPercent(series, prog);
      return pct >= 30 ? { series, next, pct } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.pct - a!.pct)
    .slice(0, 3);

  // Monthly missions summary
  const month = currentMonthKey();
  const instances = buildMissionInstances(month);
  const definitions = getMissionsForMonth(month);
  const missionProgress = computeUserMissionProgress(
    instances, definitions,
    (metricId) => getUserMetricValue(activeUserId, metricId),
    activeUserId
  );
  const completedMissions = completedMissionCount(missionProgress);
  const totalMissions = instances.length;

  // Active challenges
  const activeChallenges = challenges.filter(
    (c) =>
      (c.createdByUserId === activeUserId || c.assignedToUserId === activeUserId) &&
      (c.status === "active" || c.status === "sent")
  ).slice(0, 2);

  // Rival XP for mini comparison
  const rivalXp = getUserTotalXp(rivalId);
  const rival = USERS[rivalId];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-5 animate-fade-in">

        {/* ── Header: user + level ── */}
        <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: `${user.color}15`, border: `2px solid ${user.color}30` }}
              >
                {user.avatar}
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Jugando como</p>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{user.name}</h1>
                <p className="text-sm mt-0.5" style={{ color: levelConfig.color }}>
                  {levelConfig.icon} {levelConfig.title} · Nivel {level}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold font-mono" style={{ color: user.color }}>
                {myXp.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">XP total</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
              <span>Nivel {level}</span>
              <span>{xpToNext > 0 ? `${xpToNext.toLocaleString()} XP para el siguiente` : "Nivel máximo"}</span>
            </div>
            <Progress value={progress} color={user.color} />
          </div>
          <div className="mt-4 flex gap-3">
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <Flame className="h-4 w-4 text-[var(--gold)]" />
              <span className="font-semibold text-[var(--text-primary)]">{streak}</span> días seguidos
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <Trophy className="h-4 w-4 text-[var(--violet)]" />
              <span className="font-semibold text-[var(--text-primary)]">{myProgress.filter(p => p.currentLevel > 0).length}</span> logros
            </div>
          </div>
        </div>

        {/* ── CTA: Register ── */}
        <Button
          size="lg"
          className="w-full justify-center gap-2 text-base font-semibold"
          onClick={() => navigate("/register")}
        >
          <PlusCircle className="h-5 w-5" />
          Registrar actividad
        </Button>

        {/* ── Monthly missions summary ── */}
        <div
          className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 shadow-card cursor-pointer hover:shadow-card-md transition-shadow"
          onClick={() => navigate("/challenges")}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
                Misiones de {format(new Date(), "MMMM", { locale: es })}
              </p>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5">
                {completedMissions} de {totalMissions} completadas
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-[var(--text-muted)]" />
          </div>
          <Progress
            value={(completedMissions / totalMissions) * 100}
            color="var(--emerald)"
          />
          <div className="mt-3 space-y-1.5">
            {instances.slice(0, 3).map((inst, i) => {
              const def = definitions.find(d => d.id === inst.definitionId);
              const prog = missionProgress[i];
              const done = (prog?.currentValue ?? 0) >= (prog?.targetValue ?? 1);
              return def ? (
                <div key={inst.id} className="flex items-center gap-2.5">
                  <CheckCircle2
                    className={cn("h-4 w-4 flex-shrink-0", done ? "text-[var(--emerald)]" : "text-[var(--bg-border)]")}
                  />
                  <span className={cn("text-sm flex-1 truncate", done ? "line-through text-[var(--text-muted)]" : "text-[var(--text-secondary)]")}>
                    {def.title}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                    {prog?.currentValue ?? 0}/{prog?.targetValue ?? def.targetValue}
                  </span>
                </div>
              ) : null;
            })}
          </div>
          <p className="text-xs text-[var(--accent)] mt-2 font-medium">Ver todas las misiones →</p>
        </div>

        {/* ── Near-complete achievements ── */}
        {nearComplete.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Cerca de desbloquear</h2>
              <button onClick={() => navigate("/achievements")} className="text-xs text-[var(--accent)] font-medium">Ver logros</button>
            </div>
            <div className="space-y-2">
              {nearComplete.map(item => (
                <div
                  key={item!.series.id}
                  className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-3 shadow-card cursor-pointer hover:shadow-card-md transition-shadow"
                  onClick={() => navigate(`/achievements/${item!.series.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item!.series.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item!.series.name}</p>
                        <span className="text-xs font-semibold ml-2 flex-shrink-0" style={{ color: "var(--accent)" }}>
                          {Math.round(item!.pct)}%
                        </span>
                      </div>
                      <Progress value={item!.pct} color="var(--accent)" thin />
                      <p className="text-xs text-[var(--text-muted)] mt-1">Siguiente: {item!.next.label} · +{item!.next.xpReward} XP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Active challenge or CTA ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Reto con {rival.name}</h2>
            <button onClick={() => navigate("/challenges")} className="text-xs text-[var(--accent)] font-medium">Ver retos</button>
          </div>
          {activeChallenges.length > 0 ? (
            <div className="space-y-2">
              {activeChallenges.map(ch => (
                <div
                  key={ch.id}
                  className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-3 shadow-card cursor-pointer hover:shadow-card-md transition-shadow"
                  onClick={() => navigate("/challenges")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{ch.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{ch.description}</p>
                    </div>
                    <Badge variant={ch.status === "sent" ? "gold" : "emerald"} className="flex-shrink-0">
                      {ch.status === "sent" ? "Pendiente" : "Activo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed border-[var(--bg-border)] p-4 text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
              onClick={() => navigate("/challenges")}
            >
              <Swords className="h-6 w-6 mx-auto mb-2 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-secondary)]">Sin retos activos</p>
              <p className="text-xs text-[var(--accent)] mt-1 font-medium">Lanzar un reto a {rival.name} →</p>
            </div>
          )}
        </div>

        {/* ── Recent activity ── */}
        {recentEvents.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2.5">Última actividad</h2>
            <div className="space-y-2">
              {recentEvents.map(evt => (
                <div key={evt.id} className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-3 shadow-card flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: `${user.color}12` }}
                  >
                    {PROGRESS_EVENT_ICONS[evt.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {PROGRESS_EVENT_LABELS[evt.type] ?? evt.type}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {format(new Date(evt.occurredAt), "d MMM 'a las' HH:mm", { locale: es })}
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

        {/* ── Mini rivalry ── */}
        <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 shadow-card">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium mb-3">XP Total</p>
          <div className="space-y-3">
            {([{ u: USERS[activeUserId], xp: myXp }, { u: rival, xp: rivalXp }] as const).map(({ u, xp }) => {
              const maxXp = Math.max(myXp, rivalXp, 1);
              return (
                <div key={u.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{u.name}</span>
                    <span className="text-sm font-bold font-mono" style={{ color: u.color }}>{xp.toLocaleString()}</span>
                  </div>
                  <Progress value={(xp / maxXp) * 100} color={u.color} thin />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
