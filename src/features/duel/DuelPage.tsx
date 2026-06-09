import { Trophy, Flame, Zap, Star, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { getProgressXpByPeriod, getLatestProgressEvents } from "@/domain/progress/progress.service";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress, Button } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";

function formatPoints(value: number) {
  return `${value} XP`;
}

export function DuelPage() {
  const scores = useAppStore((s) => s.scores);
  const userAchievements = useAppStore((s) => s.userAchievements);
  const progressEvents = useAppStore((s) => s.progressEvents);
  const workouts = useAppStore((s) => s.workouts);
  const activeUserId = useAppStore((s) => s.activeUserId);
  const otherUserId = activeUserId === "javier" ? "rival" : "javier";
  const metrics = ["weeklyXp", "monthlyXp", "achievements", "challengesWon", "workouts", "savings", "streak"] as const;

  const userStats = useMemo(() => {
    const userScore = scores.find((record) => record.userId === activeUserId);
    const rivalScore = scores.find((record) => record.userId === otherUserId);
    const userEvents = progressEvents.filter((event) => event.userId === activeUserId);
    const rivalEvents = progressEvents.filter((event) => event.userId === otherUserId);
    const userWorkouts = workouts.filter((w) => w.userId === activeUserId && !w.deletedAt).length;
    const rivalWorkouts = workouts.filter((w) => w.userId === otherUserId && !w.deletedAt).length;

    return {
      active: {
        profile: USERS[activeUserId],
        score: userScore,
        weeklyXp: getProgressXpByPeriod(userEvents, 7),
        monthlyXp: getProgressXpByPeriod(userEvents, 30),
        achievements: userAchievements.filter((ua) => ua.userId === activeUserId && ua.status === "unlocked").length,
        challengesWon: userScore?.challengesWon ?? 0,
        workouts: userWorkouts,
        savings: userScore?.monthlySavings ?? 0,
        streak: calculateStreak(userEvents),
      },
      rival: {
        profile: USERS[otherUserId],
        score: rivalScore,
        weeklyXp: getProgressXpByPeriod(rivalEvents, 7),
        monthlyXp: getProgressXpByPeriod(rivalEvents, 30),
        achievements: userAchievements.filter((ua) => ua.userId === otherUserId && ua.status === "unlocked").length,
        challengesWon: rivalScore?.challengesWon ?? 0,
        workouts: rivalWorkouts,
        savings: rivalScore?.monthlySavings ?? 0,
        streak: calculateStreak(rivalEvents),
      },
    };
  }, [activeUserId, otherUserId, progressEvents, scores, userAchievements, workouts]);

  const lead = userStats.active.weeklyXp - userStats.rival.weeklyXp;

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Duelo"
        subtitle="Compara tu progreso con el rival en una batalla de XP."
      />

      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        <Card glow="cyan">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-5 w-5 text-accent-cyan" />
              <Badge variant="default">Diferencia semanal</Badge>
            </div>
            <p className="font-display text-3xl text-accent-cyan">{lead > 0 ? `+${lead}` : `${lead}`}</p>
            <p className="text-xs text-text-muted mt-1">XP a favor del jefe</p>
          </CardContent>
        </Card>

        <Card glow="violet">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Star className="h-5 w-5 text-accent-violet" />
              <Badge variant="violet">Rival</Badge>
            </div>
            <p className="text-2xl font-display text-text-primary">
              {userStats.rival.score?.totalPoints ?? 0} XP
            </p>
            <p className="text-xs text-text-muted mt-1">Puntos totales</p>
          </CardContent>
        </Card>

        <Card glow="emerald">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Flame className="h-5 w-5 text-accent-amber" />
              <Badge variant="emerald">Racha</Badge>
            </div>
            <p className="font-display text-3xl text-accent-emerald">{userStats.active.streak}</p>
            <p className="text-xs text-text-muted mt-1">Días seguidos con progreso</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-text-primary" />
              <CardTitle>Javier vs Rival</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric} className="grid grid-cols-3 gap-3 items-center">
                <div className="text-xs text-text-muted uppercase tracking-widest">{metric === "weeklyXp" ? "XP sem." : metric === "monthlyXp" ? "XP mes" : metric === "achievements" ? "Logros" : metric === "challengesWon" ? "Retos gan." : metric === "workouts" ? "Entrenos" : metric === "savings" ? "Ahorro" : "Racha"}</div>
                <div className="font-mono text-sm text-text-primary text-right">{formatPoints(userStats.active[metric])}</div>
                <div className="font-mono text-sm text-text-secondary text-right">{formatPoints(userStats.rival[metric])}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 border-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent-cyan" />
              <CardTitle>Estado actual</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">{USERS[activeUserId].name}</p>
                <p className="text-xs text-text-muted">Nivel {userStats.active.score?.level ?? 1}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-display">{userStats.active.score?.totalPoints ?? 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">{USERS[otherUserId].name}</p>
                <p className="text-xs text-text-muted">Nivel {userStats.rival.score?.level ?? 1}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-display">{userStats.rival.score?.totalPoints ?? 0}</span>
              </div>
            </div>
            <div className="rounded-2xl bg-bg-card p-4">
              <p className="text-sm text-text-secondary">Ventaja actual</p>
              <div className="mt-2 flex items-center gap-2 text-lg font-bold">
                {lead >= 0 ? <ArrowUpRight className="h-5 w-5 text-accent-emerald" /> : <ArrowDownRight className="h-5 w-5 text-accent-rose" />}
                {Math.abs(lead)} XP
              </div>
            </div>
            <Button className="w-full">Ver reto del duelo</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card glow="cyan">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-5 w-5 text-accent-cyan" />
              <Badge variant="default">Tu XP semanal</Badge>
            </div>
            <p className="font-display text-3xl text-accent-cyan">{formatPoints(userStats.active.weeklyXp)}</p>
          </CardContent>
        </Card>
        <Card glow="violet">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Star className="h-5 w-5 text-accent-violet" />
              <Badge variant="violet">Logros</Badge>
            </div>
            <p className="font-display text-3xl text-accent-violet">{userStats.active.achievements}</p>
            <p className="text-xs text-text-muted mt-1">Desbloqueados</p>
          </CardContent>
        </Card>
        <Card glow="emerald">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <ShieldCheck className="h-5 w-5 text-accent-emerald" />
              <Badge variant="emerald">Ahorro mes</Badge>
            </div>
            <p className="font-display text-3xl text-accent-emerald">{userStats.active.savings}€</p>
            <p className="text-xs text-text-muted mt-1">Este mes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function calculateStreak(events: { occurredAt: string }[]) {
  const days = [...new Set(events.map((event) => event.occurredAt.split("T")[0]))]
    .sort()
    .reverse();
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < days.length; i++) {
    const date = new Date(days[i]);
    const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === i) streak++;
    else break;
  }

  return streak;
}
