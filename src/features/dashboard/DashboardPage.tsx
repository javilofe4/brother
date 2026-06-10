import { Flame, Star, Trophy, Zap, TrendingUp, Swords } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { USERS, type UserId } from "@/domain/users/user.types";
import { getLevelFromXp } from "@/shared/config/xpConfig";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { getSeriesNextLevel, getSeriesProgressPercent } from "@/domain/achievements/achievement.types";
import type { XpLedgerEntry } from "@/domain/xp/xpLedger.types";
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from "@/shared/components/ui";
import { PROGRESS_EVENT_ICONS } from "@/domain/progress/progressEvent.types";

function buildWeeklyXpData(entries: XpLedgerEntry[]) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = subDays(new Date(), 6 - index);
    const dayStr = day.toISOString().slice(0, 10);
    return {
      day: format(day, "EEE", { locale: es }),
      javier: entries
        .filter((entry) => entry.userId === "javier" && entry.occurredAt.startsWith(dayStr))
        .reduce((sum, entry) => sum + entry.amount, 0),
      rival: entries
        .filter((entry) => entry.userId === "rival" && entry.occurredAt.startsWith(dayStr))
        .reduce((sum, entry) => sum + entry.amount, 0),
    };
  });
}

export function DashboardPage() {
  const activeUserId = useAppStore((state) => state.activeUserId);
  const xpLedger = useAppStore((state) => state.xpLedger);
  const events = useAppStore((state) => state.progressEvents);
  const getUserTotalXp = useAppStore((state) => state.getUserTotalXp);
  const getUserAchievementProgress = useAppStore((state) => state.getUserAchievementProgress);
  const getUserMetricValue = useAppStore((state) => state.getUserMetricValue);
  const getStreak = useAppStore((state) => state.getStreak);

  const activeUser = USERS[activeUserId];
  const myXp = getUserTotalXp(activeUserId);
  const { level, levelConfig, progress, xpToNext } = getLevelFromXp(myXp);
  const streak = getStreak(activeUserId);
  const myProgress = getUserAchievementProgress(activeUserId);
  const myEvents = events.filter((event) => event.userId === activeUserId).slice(0, 4);
  const allSessions = getUserMetricValue(activeUserId, "all_sessions_total");
  const unlockedCount = myProgress.filter((item) => item.currentLevel > 0).length;

  const latestUnlocks = myProgress
    .flatMap((item) => {
      const series = ACHIEVEMENT_CATALOG.find((candidate) => candidate.id === item.seriesId);
      if (!series) return [];
      return item.unlockedLevels.map((unlock) => ({
        series,
        unlock,
        level: series.levels.find((levelItem) => levelItem.level === unlock.level),
      }));
    })
    .filter((item) => item.level)
    .sort((a, b) => b.unlock.unlockedAt.localeCompare(a.unlock.unlockedAt))
    .slice(0, 3);

  const nearComplete = ACHIEVEMENT_CATALOG.map((series) => {
    const item = myProgress.find((progressItem) => progressItem.seriesId === series.id);
    const nextLevel = getSeriesNextLevel(series, item);
    if (!nextLevel) return null;
    const pct = getSeriesProgressPercent(series, item);
    return pct >= 40 ? { series, progress: item, nextLevel, pct } : null;
  })
    .filter(Boolean)
    .sort((a, b) => b!.pct - a!.pct)
    .slice(0, 3);

  const weeklyData = buildWeeklyXpData(xpLedger);
  const rivalId: UserId = activeUserId === "javier" ? "rival" : "javier";
  const rival = USERS[rivalId];
  const rivalXp = getUserTotalXp(rivalId);
  const maxDuelXp = Math.max(myXp, rivalXp, 1);

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      <div className="mb-7">
        <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Sesion de hoy</p>
        <h1 className="font-display text-5xl tracking-wide leading-none" style={{ color: activeUser.color }}>
          {activeUser.avatar} {activeUser.name}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium text-text-secondary">{levelConfig.title}</span>
          <span className="text-text-muted">·</span>
          <span className="font-mono text-sm" style={{ color: activeUser.color }}>
            {myXp.toLocaleString()} XP
          </span>
        </div>
        <div className="mt-3 max-w-sm">
          <div className="mb-1 flex justify-between text-[10px] text-text-muted">
            <span>Nivel {level}</span>
            <span>{xpToNext > 0 ? `${xpToNext} XP para Nivel ${level + 1}` : "Nivel maximo"}</span>
          </div>
          <Progress value={progress} color={levelConfig.color} />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card glow="cyan">
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <Zap className="h-5 w-5 text-accent-cyan" />
              <Badge variant="default">Ledger</Badge>
            </div>
            <p className="font-display text-3xl text-accent-cyan">{myXp.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-text-muted">XP total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <Flame className="h-5 w-5 text-accent-amber" />
              <Badge variant="amber">Racha</Badge>
            </div>
            <p className="font-display text-3xl text-accent-amber">{streak}</p>
            <p className="mt-0.5 text-xs text-text-muted">dias activos</p>
          </CardContent>
        </Card>
        <Card glow="violet">
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <Trophy className="h-5 w-5 text-accent-violet" />
              <Badge variant="violet">Logros</Badge>
            </div>
            <p className="font-display text-3xl text-accent-violet">{unlockedCount}</p>
            <p className="mt-0.5 text-xs text-text-muted">series iniciadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <Star className="h-5 w-5 text-accent-emerald" />
              <Badge variant="emerald">Sesiones</Badge>
            </div>
            <p className="font-display text-3xl text-text-primary">{allSessions}</p>
            <p className="mt-0.5 text-xs text-text-muted">metric snapshot</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-cyan" />
              <CardTitle>XP semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gJ" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="day" tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8888aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#16161f", border: "1px solid #1e1e2e", borderRadius: "8px", color: "#f0f0ff", fontSize: 12 }}
                    formatter={(value: unknown, name: unknown) => [`${value} XP`, name === "javier" ? "Javier" : "Rival"]}
                  />
                  <Area type="monotone" dataKey="javier" stroke="#00e5ff" strokeWidth={2} fill="url(#gJ)" />
                  <Area type="monotone" dataKey="rival" stroke="#f43f5e" strokeWidth={2} fill="url(#gR)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-accent-rose" />
              <CardTitle>Duelo rapido</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: activeUser, xp: myXp },
                { user: rival, xp: rivalXp },
              ].map(({ user, xp }) => (
                <div key={user.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{user.name}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: user.color }}>
                      {xp.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(xp / maxDuelXp) * 100} color={user.color} />
                </div>
              ))}
              <p className="border-t border-bg-border pt-2 text-center text-xs text-text-muted">
                Diferencia <span className="font-mono font-bold text-text-primary">{Math.abs(myXp - rivalXp)} XP</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {latestUnlocks.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">
            Ultimos logros desbloqueados
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {latestUnlocks.map((item) => (
              <Card key={`${item.series.id}-${item.unlock.level}`}>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.series.icon}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{item.series.name}</p>
                      <p className="text-xs text-text-muted">{item.level?.label}</p>
                    </div>
                    <Badge variant="amber" className="ml-auto">+{item.level?.xpReward} XP</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {nearComplete.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">
            Proximo logro cercano
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {nearComplete.map((item) => (
              <Card key={item!.series.id}>
                <CardContent>
                  <div className="mb-2 flex items-start gap-3">
                    <span className="text-2xl">{item!.series.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">{item!.series.name}</p>
                      <p className="text-xs text-text-muted">{item!.nextLevel.label}</p>
                    </div>
                    <Badge variant="amber">{Math.round(item!.pct)}%</Badge>
                  </div>
                  <Progress value={item!.pct} color="#00e5ff" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {myEvents.length > 0 && (
        <div>
          <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">Actividad reciente</h2>
          <div className="space-y-2">
            {myEvents.map((event) => (
              <Card key={event.id} className="flex items-center gap-3 hover:border-bg-border/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: `${activeUser.color}15` }}>
                  {PROGRESS_EVENT_ICONS[event.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {event.type.split("_").join(" ")}
                  </p>
                  <p className="text-xs text-text-muted">
                    {format(new Date(event.occurredAt), "d MMM 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
                <Badge variant="default">+{event.xpFromActivity} XP</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
