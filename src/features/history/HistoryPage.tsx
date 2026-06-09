import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dumbbell, Wallet, Swords, Zap } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { WORKOUT_LABELS } from "@/domain/workouts/workout.types";
import { FINANCE_TYPE_LABELS, CATEGORY_LABELS } from "@/domain/finances/finance.types";
import { Card, CardContent, Badge } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";
import { calculateWorkoutPoints } from "@/domain/scoring/scoring.types";

interface TimelineEvent {
  id: string;
  type: "workout" | "finance" | "challenge" | "score";
  title: string;
  subtitle: string;
  userId: string;
  date: string;
  points?: number;
  color: string;
  icon: React.ElementType;
}

export function HistoryPage() {
  const workouts = useAppStore((s) => s.workouts);
  const finances = useAppStore((s) => s.finances);
  const challenges = useAppStore((s) => s.challenges);

  const events: TimelineEvent[] = [
    ...workouts.filter((w) => !w.deletedAt).map((w) => ({
      id: `w-${w.id}`,
      type: "workout" as const,
      title: `Entrenamiento: ${WORKOUT_LABELS[w.type]}`,
      subtitle: `${w.durationMinutes}min · Intensidad ${w.intensity}/10`,
      userId: w.userId,
      date: w.createdAt,
      points: calculateWorkoutPoints(w.intensity),
      color: "#00e5ff",
      icon: Dumbbell,
    })),
    ...finances.filter((f) => !f.deletedAt).map((f) => ({
      id: `f-${f.id}`,
      type: "finance" as const,
      title: `${FINANCE_TYPE_LABELS[f.type]}: ${f.amount}€`,
      subtitle: CATEGORY_LABELS[f.category],
      userId: f.userId,
      date: f.createdAt,
      color: f.type === "income" ? "#10b981" : f.type === "saving" ? "#7c3aed" : "#f43f5e",
      icon: Wallet,
    })),
    ...challenges.map((c) => ({
      id: `c-${c.id}`,
      type: "challenge" as const,
      title: `Reto: ${c.title}`,
      subtitle: `${c.points}pts en juego · Estado: ${c.status}`,
      userId: c.createdBy,
      date: c.createdAt,
      color: "#f59e0b",
      icon: Swords,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group by date
  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, e) => {
    const day = e.date.split("T")[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(e);
    return acc;
  }, {});

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Historial"
        subtitle={`${events.length} eventos registrados`}
      />

      {events.length === 0 && (
        <Card className="text-center py-12">
          <Zap className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted">No hay actividad registrada todavía</p>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([day, dayEvents]) => (
          <div key={day}>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-3">
              {format(new Date(day), "EEEE, d 'de' MMMM", { locale: es })}
            </p>
            <div className="relative border-l-2 border-bg-border pl-4 space-y-3">
              {dayEvents.map((event) => {
                const user = USERS[event.userId as keyof typeof USERS];
                const Icon = event.icon;
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[21px] top-3.5 h-3 w-3 rounded-full border-2 border-bg-base"
                      style={{ background: event.color }}
                    />
                    <Card className="hover:border-bg-border/60 transition-colors">
                      <CardContent className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                          style={{ background: `${event.color}15` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: event.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{event.title}</p>
                          <p className="text-xs text-text-muted mt-0.5">{event.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span>{user?.avatar}</span>
                            <span className="text-xs text-text-muted">{user?.name}</span>
                          </div>
                          {event.points && (
                            <Badge variant="default">+{event.points}pts</Badge>
                          )}
                          <span className="text-xs text-text-muted font-mono">
                            {format(new Date(event.date), "HH:mm")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
