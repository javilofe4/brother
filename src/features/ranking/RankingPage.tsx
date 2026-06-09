import { Trophy, Dumbbell, Swords, PiggyBank, Star } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";

export function RankingPage() {
  const scores = useAppStore((s) => s.scores);
  const workouts = useAppStore((s) => s.workouts);
  const challenges = useAppStore((s) => s.challenges);
  const finances = useAppStore((s) => s.finances);

  const sorted = [...scores].sort((a, b) => b.totalPoints - a.totalPoints);
  const leader = sorted[0];
  const second = sorted[1];

  const maxPoints = Math.max(leader.totalPoints, second.totalPoints);

  const getWorkoutCount = (userId: string) =>
    workouts.filter((w) => w.userId === userId && !w.deletedAt).length;

  const getChallengesWon = (userId: string) =>
    challenges.filter((c) => c.createdBy === userId && c.status === "completed").length;

  const getMonthlySavings = (userId: string) =>
    finances
      .filter((f) => f.userId === userId && f.type === "saving" && !f.deletedAt)
      .reduce((acc, f) => acc + f.amount, 0);

  const stats = [
    {
      label: "Puntos totales",
      icon: Star,
      getValue: (uid: string) => scores.find((s) => s.userId === uid)?.totalPoints ?? 0,
      format: (v: number) => `${v}pts`,
      unit: "pts",
    },
    {
      label: "Entrenamientos",
      icon: Dumbbell,
      getValue: getWorkoutCount,
      format: (v: number) => `${v}`,
      unit: "sesiones",
    },
    {
      label: "Retos ganados",
      icon: Swords,
      getValue: getChallengesWon,
      format: (v: number) => `${v}`,
      unit: "retos",
    },
    {
      label: "Ahorro mensual",
      icon: PiggyBank,
      getValue: getMonthlySavings,
      format: (v: number) => `${v}€`,
      unit: "€",
    },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Ranking"
        subtitle="¿Quién domina este mes?"
      />

      {/* Podium */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {sorted.map((score, i) => {
          const user = USERS[score.userId];
          const isLeader = i === 0;
          return (
            <Card
              key={score.userId}
              className={`relative overflow-hidden text-center py-6 transition-all ${
                isLeader ? "border-accent-amber/50 bg-accent-amber/5" : ""
              }`}
            >
              {isLeader && (
                <div className="absolute top-3 right-3">
                  <Trophy className="h-5 w-5 text-accent-amber" />
                </div>
              )}
              <div
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                style={{
                  background: `${user.color}20`,
                  border: `2px solid ${isLeader ? user.color : user.color + "40"}`,
                  boxShadow: isLeader ? `0 0 24px ${user.color}40` : "none",
                }}
              >
                {user.avatar}
              </div>
              <p className="font-medium text-text-primary">{user.name}</p>
              <p
                className="font-display text-4xl mt-1"
                style={{ color: user.color }}
              >
                {score.totalPoints}
              </p>
              <p className="text-xs text-text-muted">puntos totales</p>
              <Badge
                className="mt-2"
                style={{ background: `${user.color}20`, color: user.color }}
              >
                Nivel {score.level}
              </Badge>
              {isLeader && (
                <div className="mt-3">
                  <Badge variant="amber">🏆 LÍDER</Badge>
                </div>
              )}
              <div className="mt-3 px-4">
                <Progress value={(score.totalPoints / maxPoints) * 100} color={user.color} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stat comparisons */}
      <h2 className="text-xs uppercase tracking-widest text-text-muted mb-4">Comparativa detallada</h2>
      <div className="space-y-3">
        {stats.map(({ label, icon: Icon, getValue, format: fmt }) => {
          const vals = sorted.map((s) => ({ userId: s.userId, val: getValue(s.userId) }));
          const maxVal = Math.max(...vals.map((v) => v.val), 1);

          return (
            <Card key={label}>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="h-4 w-4 text-text-muted" />
                  <span className="text-xs uppercase tracking-wide text-text-muted">{label}</span>
                </div>
                <div className="space-y-3">
                  {vals.map(({ userId, val }) => {
                    const user = USERS[userId];
                    const isWinner = val === maxVal && val > 0;
                    return (
                      <div key={userId}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span>{user.avatar}</span>
                            <span className="text-sm text-text-primary">{user.name}</span>
                            {isWinner && (
                              <Badge style={{ background: `${user.color}20`, color: user.color, fontSize: "9px" }}>
                                GANADOR
                              </Badge>
                            )}
                          </div>
                          <span className="font-mono text-sm font-medium" style={{ color: user.color }}>
                            {fmt(val)}
                          </span>
                        </div>
                        <Progress
                          value={maxVal > 0 ? (val / maxVal) * 100 : 0}
                          color={user.color}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
