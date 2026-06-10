import { startOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";
import type { ElementType } from "react";
import { Trophy, Zap, Target, Star, Dumbbell, Swords } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS, type UserId } from "@/domain/users/user.types";
import { getLevelFromXp } from "@/shared/config/xpConfig";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from "@/shared/components/ui";

interface StatRowProps {
  label: string;
  icon: ElementType;
  valueA: number | string;
  valueB: number | string;
  numA: number;
  numB: number;
  colorA: string;
  colorB: string;
}

function StatRow({ label, icon: Icon, valueA, valueB, numA, numB, colorA, colorB }: StatRowProps) {
  const max = Math.max(numA, numB, 1);
  const winnerA = numA > numB;
  const winnerB = numB > numA;
  return (
    <div className="border-b border-bg-border py-3 last:border-0">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-text-muted" />
        <span className="text-xs uppercase tracking-wide text-text-muted">{label}</span>
      </div>
      <div className="grid grid-cols-3 items-center gap-2">
        <div className="text-right">
          <span className="font-mono text-sm font-bold" style={{ color: winnerA ? colorA : "#8888aa" }}>
            {valueA}
          </span>
        </div>
        <div className="relative flex h-2 gap-0.5">
          <div className="flex flex-1 justify-end overflow-hidden rounded-l-full bg-bg-border">
            <div className="h-full rounded-l-full" style={{ width: `${(numA / max) * 100}%`, background: colorA }} />
          </div>
          <div className="w-px shrink-0 bg-bg-border" />
          <div className="flex-1 overflow-hidden rounded-r-full bg-bg-border">
            <div className="h-full rounded-r-full" style={{ width: `${(numB / max) * 100}%`, background: colorB }} />
          </div>
        </div>
        <div>
          <span className="font-mono text-sm font-bold" style={{ color: winnerB ? colorB : "#8888aa" }}>
            {valueB}
          </span>
        </div>
      </div>
    </div>
  );
}

function monthlyXp(entries: ReturnType<typeof useAppStore.getState>["xpLedger"], userId: UserId) {
  const start = startOfMonth(new Date()).toISOString();
  return entries
    .filter((entry) => entry.userId === userId && entry.occurredAt >= start)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function DuelPage() {
  const xpLedger = useAppStore((state) => state.xpLedger);
  const getUserTotalXp = useAppStore((state) => state.getUserTotalXp);
  const getUserAchievementProgress = useAppStore((state) => state.getUserAchievementProgress);
  const getUserMetricValue = useAppStore((state) => state.getUserMetricValue);

  const userA = USERS.javier;
  const userB = USERS.rival;
  const xpA = getUserTotalXp("javier");
  const xpB = getUserTotalXp("rival");
  const levelA = getLevelFromXp(xpA);
  const levelB = getLevelFromXp(xpB);
  const monthXpA = monthlyXp(xpLedger, "javier");
  const monthXpB = monthlyXp(xpLedger, "rival");
  const progressA = getUserAchievementProgress("javier");
  const progressB = getUserAchievementProgress("rival");
  const unlockedA = progressA.reduce((sum, progress) => sum + progress.unlockedLevels.length, 0);
  const unlockedB = progressB.reduce((sum, progress) => sum + progress.unlockedLevels.length, 0);
  const trophiesA = progressA.reduce((sum, progress) => {
    const series = ACHIEVEMENT_CATALOG.find((item) => item.id === progress.seriesId);
    return sum + progress.unlockedLevels.filter((unlock) =>
      series?.levels.find((level) => level.level === unlock.level)?.rewardType === "trophy"
    ).length;
  }, 0);
  const trophiesB = progressB.reduce((sum, progress) => {
    const series = ACHIEVEMENT_CATALOG.find((item) => item.id === progress.seriesId);
    return sum + progress.unlockedLevels.filter((unlock) =>
      series?.levels.find((level) => level.level === unlock.level)?.rewardType === "trophy"
    ).length;
  }, 0);
  const sessionsA = getUserMetricValue("javier", "all_sessions_total");
  const sessionsB = getUserMetricValue("rival", "all_sessions_total");
  const leader = xpA + unlockedA * 25 + trophiesA * 100 >= xpB + unlockedB * 25 + trophiesB * 100
    ? userA
    : userB;

  const recentUnlocks = [...progressA, ...progressB]
    .flatMap((progress) => {
      const series = ACHIEVEMENT_CATALOG.find((item) => item.id === progress.seriesId);
      if (!series) return [];
      return progress.unlockedLevels.map((unlock) => ({
        userId: progress.userId,
        series,
        unlock,
      }));
    })
    .sort((a, b) => b.unlock.unlockedAt.localeCompare(a.unlock.unlockedAt))
    .slice(0, 5);

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      <div className="mb-6">
        <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Rivalidad</p>
        <h1 className="font-display text-4xl tracking-wide text-text-primary">Duelo</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {format(new Date(), "MMMM yyyy", { locale: es })}
        </p>
      </div>

      <Card className="relative mb-5 overflow-hidden">
        <CardContent className="relative z-10 py-6">
          <div className="grid grid-cols-3 items-center gap-4">
            {[userA, null, userB].map((user) => {
              if (!user) {
                return (
                  <div key="vs" className="text-center">
                    <Swords className="mx-auto mb-2 h-7 w-7 text-text-muted" />
                    <p className="font-display text-4xl tracking-widest text-text-muted">VS</p>
                    <p className="mt-2 text-xs text-text-muted">
                      Delta <span className="font-mono text-text-primary">{Math.abs(xpA - xpB)} XP</span>
                    </p>
                  </div>
                );
              }
              const xp = user.id === "javier" ? xpA : xpB;
              const level = user.id === "javier" ? levelA : levelB;
              return (
                <div key={user.id} className="text-center">
                  <div
                    className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                    style={{ background: `${user.color}20`, border: `2px solid ${user.color}` }}
                  >
                    {user.avatar}
                  </div>
                  <p className="font-semibold text-text-primary">{user.name}</p>
                  <p className="text-xs" style={{ color: user.color }}>{level.levelConfig.title}</p>
                  <p className="mt-1 font-mono text-sm font-bold" style={{ color: user.color }}>
                    {xp.toLocaleString()} XP
                  </p>
                  {leader.id === user.id && <Badge variant="amber" className="mt-2 text-[10px]">LIDER</Badge>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mb-2 grid grid-cols-3 items-center px-4">
        <p className="text-right text-xs font-semibold" style={{ color: userA.color }}>{userA.name}</p>
        <div />
        <p className="text-xs font-semibold" style={{ color: userB.color }}>{userB.name}</p>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle>Comparativa derivada</CardTitle>
        </CardHeader>
        <CardContent>
          <StatRow label="XP total" icon={Zap} valueA={xpA.toLocaleString()} valueB={xpB.toLocaleString()} numA={xpA} numB={xpB} colorA={userA.color} colorB={userB.color} />
          <StatRow label="XP mensual" icon={Star} valueA={monthXpA} valueB={monthXpB} numA={monthXpA} numB={monthXpB} colorA={userA.color} colorB={userB.color} />
          <StatRow label="Logros desbloqueados" icon={Trophy} valueA={unlockedA} valueB={unlockedB} numA={unlockedA} numB={unlockedB} colorA={userA.color} colorB={userB.color} />
          <StatRow label="Trofeos" icon={Target} valueA={trophiesA} valueB={trophiesB} numA={trophiesA} numB={trophiesB} colorA={userA.color} colorB={userB.color} />
          <StatRow label="Sesiones totales" icon={Dumbbell} valueA={sessionsA} valueB={sessionsB} numA={sessionsA} numB={sessionsB} colorA={userA.color} colorB={userB.color} />
          <StatRow label="Nivel" icon={Star} valueA={`Nv.${levelA.level}`} valueB={`Nv.${levelB.level}`} numA={levelA.level} numB={levelB.level} colorA={userA.color} colorB={userB.color} />
        </CardContent>
      </Card>

      <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">
        Progreso por logro
      </h2>
      <div className="mb-5 space-y-2">
        {ACHIEVEMENT_CATALOG.slice(0, 10).map((series) => {
          const pA = progressA.find((item) => item.seriesId === series.id);
          const pB = progressB.find((item) => item.seriesId === series.id);
          const maxValue = series.levels[series.levels.length - 1]?.threshold ?? 1;
          const valueA = pA?.currentValue ?? 0;
          const valueB = pB?.currentValue ?? 0;
          return (
            <Card key={series.id}>
              <CardContent>
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-lg">{series.icon}</span>
                  <span className="text-sm font-medium text-text-primary">{series.name}</span>
                  <span className="ml-auto text-[10px] text-text-muted">
                    Nv.{pA?.currentLevel ?? 0} vs Nv.{pB?.currentLevel ?? 0}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="flex justify-end">
                    <span className="font-mono text-xs" style={{ color: userA.color }}>{valueA}</span>
                  </div>
                  <div className="relative flex h-1.5 gap-0.5">
                    <div className="flex flex-1 justify-end overflow-hidden rounded-l-full bg-bg-border">
                      <div className="h-full rounded-l-full" style={{ width: `${(valueA / maxValue) * 100}%`, background: userA.color }} />
                    </div>
                    <div className="w-px shrink-0 bg-bg-border" />
                    <div className="flex-1 overflow-hidden rounded-r-full bg-bg-border">
                      <div className="h-full rounded-r-full" style={{ width: `${(valueB / maxValue) * 100}%`, background: userB.color }} />
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-xs" style={{ color: userB.color }}>{valueB}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">Logros recientes</h2>
      <div className="space-y-2">
        {recentUnlocks.map((item) => {
          const user = USERS[item.userId];
          return (
            <Card key={`${item.userId}-${item.series.id}-${item.unlock.level}`}>
              <CardContent className="flex items-center gap-3 py-2.5">
                <span className="text-lg">{item.series.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-text-primary">{item.series.name}</p>
                  <p className="text-xs text-text-muted">{format(new Date(item.unlock.unlockedAt), "d MMM yyyy", { locale: es })}</p>
                </div>
                <Badge style={{ background: `${user.color}18`, color: user.color }}>{user.name}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
