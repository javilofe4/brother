import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Sparkles, Flame, Star } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import { getLatestProgressEvents, getProgressXpByPeriod } from "@/domain/progress/progress.service";
import { Card, CardHeader, CardTitle, CardContent, Progress, Badge, Button } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";

export function DashboardPage() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const scores = useAppStore((s) => s.scores);
  const progressEvents = useAppStore((s) => s.progressEvents);
  const achievements = useAppStore((s) => s.achievements);
  const userAchievements = useAppStore((s) => s.userAchievements);

  const activeUser = USERS[activeUserId];
  const otherUserId = activeUserId === "javier" ? "rival" : "javier";
  const myScore = scores.find((s) => s.userId === activeUserId)!;
  const otherScore = scores.find((s) => s.userId === otherUserId)!;

  const recentActivity = useMemo(
    () => getLatestProgressEvents(progressEvents.filter((event) => event.userId === activeUserId), 5),
    [progressEvents, activeUserId]
  );

  const nextAchievement = useMemo(() => {
    const unlockedIds = new Set(
      userAchievements.filter((ua) => ua.status === "unlocked").map((ua) => ua.achievementId)
    );
    const candidates = achievements.filter((achievement) => !unlockedIds.has(achievement.id));
    return candidates
      .sort((a, b) => (b.xpReward - a.xpReward) || a.title.localeCompare(b.title))[0];
  }, [achievements, userAchievements]);

  const weeklyXp = getProgressXpByPeriod(progressEvents.filter((event) => event.userId === activeUserId), 7);
  const monthlyXp = getProgressXpByPeriod(progressEvents.filter((event) => event.userId === activeUserId), 30);

  const streak = useMemo(() => {
    const dates = [...new Set(progressEvents
      .filter((event) => event.userId === activeUserId)
      .map((event) => event.occurredAt.split("T")[0]))]
      .sort()
      .reverse();

    const today = new Date();
    let count = 0;
    for (let i = 0; i < dates.length; i++) {
      const current = new Date(dates[i]);
      const diff = Math.floor((today.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === i) count++;
      else break;
    }
    return count;
  }, [progressEvents, activeUserId]);

  const unlockedCount = userAchievements.filter((ua) => ua.userId === activeUserId && ua.status === "unlocked").length;
  const totalAchievements = achievements.length;
  const lead = myScore.totalPoints - otherScore.totalPoints;

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Tu juego personal de progreso comienza aquí."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent-cyan via-transparent to-accent-violet rounded-xl" />
          <CardContent className="relative">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">Nivel actual</p>
                <h1 className="font-display text-5xl" style={{ color: activeUser.color }}>
                  {myScore.level}
                </h1>
              </div>
              <div className="rounded-2xl bg-bg-card px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-widest text-text-muted">XP total</p>
                <p className="text-3xl font-display text-text-primary">{myScore.totalPoints}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-text-muted mb-2">
                <span>Progreso al siguiente nivel</span>
                <span>{myScore.progressToNextLevel}/100</span>
              </div>
              <Progress value={myScore.progressToNextLevel} color={activeUser.color} showLabel />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Registrar progreso</Button>
              </Link>
              <Link to="/achievements">
                <Button variant="secondary">Ver logros</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-cyan" />
              <CardTitle>Duelo</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-text-muted">Rival</p>
              <p className="text-lg font-semibold text-text-primary">{USERS[otherUserId].name}</p>
              <p className="text-sm text-text-muted">{lead >= 0 ? `Vas ganando por ${lead} XP` : `Perdías por ${Math.abs(lead)} XP`}</p>
            </div>
            <div className="grid gap-2">
              <div className="rounded-2xl bg-bg-elevated p-3">
                <p className="text-xs uppercase tracking-widest text-text-muted">XP sem.</p>
                <p className="text-xl font-semibold text-text-primary">{weeklyXp}</p>
              </div>
              <div className="rounded-2xl bg-bg-elevated p-3">
                <p className="text-xs uppercase tracking-widest text-text-muted">XP mes</p>
                <p className="text-xl font-semibold text-text-primary">{monthlyXp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        <Card glow="cyan">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-5 w-5 text-accent-cyan" />
              <Badge variant="default">Racha</Badge>
            </div>
            <p className="font-display text-3xl text-accent-cyan">{streak}</p>
            <p className="text-xs text-text-muted mt-1">días seguidos con progreso</p>
          </CardContent>
        </Card>

        <Card glow="violet">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Star className="h-5 w-5 text-accent-violet" />
              <Badge variant="violet">Logros</Badge>
            </div>
            <p className="font-display text-3xl text-accent-violet">{unlockedCount}</p>
            <p className="text-xs text-text-muted mt-1">Desbloqueados</p>
          </CardContent>
        </Card>

        <Card glow="emerald">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Sparkles className="h-5 w-5 text-accent-emerald" />
              <Badge variant="emerald">Próximo logro</Badge>
            </div>
            <p className="font-display text-3xl text-text-primary">{nextAchievement?.title ?? "Sin nuevo objetivo"}</p>
            <p className="text-xs text-text-muted mt-1">{nextAchievement?.description ?? "Desbloquea el siguiente logro"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-muted">Actividad reciente</p>
            <h2 className="text-lg font-semibold text-text-primary">Últimos registros</h2>
          </div>
          <Badge variant="muted">{recentActivity.length}</Badge>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {recentActivity.map((event) => (
            <Card key={event.id} className="border-l-4 border-accent-cyan">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                  <Badge variant={event.xp >= 0 ? "default" : "rose"}>{event.xp} XP</Badge>
                </div>
                <p className="text-sm text-text-muted">{event.description}</p>
                <p className="text-xs text-text-muted mt-3">{new Date(event.occurredAt).toLocaleDateString("es-ES")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
