import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { ACHIEVEMENT_BY_ID } from "@/domain/achievements/achievementCatalog";
import {
  RARITY_COLORS,
  RARITY_LABELS,
  getSeriesNextLevel,
  getSeriesProgressPercent,
} from "@/domain/achievements/achievement.types";
import { METRIC_BY_ID } from "@/domain/metrics/metricDefinitions";
import { eventMatchesMetric } from "@/domain/metrics/metricEngine";
import { PROGRESS_EVENT_ICONS } from "@/domain/progress/progressEvent.types";
import {
  Card,
  CardContent,
  Badge,
  Progress,
  Button,
  cn,
} from "@/shared/components/ui";

export function AchievementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeUserId = useAppStore((state) => state.activeUserId);
  const allProgress = useAppStore((state) => state.getUserAchievementProgress(activeUserId));
  const events = useAppStore((state) => state.getUserEvents(activeUserId));

  const series = id ? ACHIEVEMENT_BY_ID[id] : undefined;
  if (!series) {
    return (
      <div className="p-6 text-center text-text-muted">
        <p>Logro no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate("/achievements")} className="mt-4">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  const metric = METRIC_BY_ID[series.dependsOnMetric];
  const progress = allProgress.find((item) => item.seriesId === series.id);
  const currentValue = progress?.currentValue ?? 0;
  const currentLevel = progress?.currentLevel ?? 0;
  const nextLevel = getSeriesNextLevel(series, progress);
  const progressPercent = getSeriesProgressPercent(series, progress);
  const isMaxed = !nextLevel;
  const accent = RARITY_COLORS[nextLevel?.rarity ?? series.rarity];
  const relatedEvents = metric
    ? events.filter((event) => eventMatchesMetric(event, metric)).slice(0, 8)
    : [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl p-6 animate-fade-in">
        <button
          onClick={() => navigate("/achievements")}
          className="mb-5 flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Todos los logros
        </button>

        <Card className="mb-5" style={{ borderColor: `${accent}55` }}>
          <CardContent className="py-6 text-center">
            <div className="mb-3 text-6xl">{series.icon}</div>
            <h1 className="mb-1 font-display text-3xl tracking-wide text-text-primary">
              {series.name}
            </h1>
            <p className="mx-auto mb-4 max-w-lg text-sm text-text-secondary">
              {series.description}
            </p>
            <div className="mb-4 flex justify-center gap-2">
              <Badge style={{ background: `${accent}18`, color: accent }}>
                {RARITY_LABELS[series.rarity]}
              </Badge>
              <Badge variant={series.status === "active" ? "emerald" : "muted"}>
                {series.status}
              </Badge>
              <Badge variant="muted">Metrica: {series.dependsOnMetric}</Badge>
            </div>

            {!isMaxed && nextLevel ? (
              <div className="mx-auto max-w-sm">
                <div className="mb-1.5 flex justify-between text-xs text-text-muted">
                  <span>{currentValue} / {nextLevel.threshold}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} color={accent} />
                <p className="mt-1.5 text-center text-xs text-text-muted">
                  Proximo: <span style={{ color: accent }}>{nextLevel.label}</span>
                </p>
              </div>
            ) : (
              <Badge variant="amber" className="px-4 py-1 text-sm">
                Trofeo completado
              </Badge>
            )}
          </CardContent>
        </Card>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card>
            <CardContent>
              <p className="text-xs uppercase tracking-widest text-text-muted">Valor actual</p>
              <p className="mt-1 font-display text-3xl text-text-primary">{currentValue}</p>
              <p className="text-xs text-text-muted">{metric?.label ?? series.dependsOnMetric}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-xs uppercase tracking-widest text-text-muted">Nivel actual</p>
              <p className="mt-1 font-display text-3xl" style={{ color: accent }}>
                {currentLevel}/{series.levels.length}
              </p>
              <p className="text-xs text-text-muted">
                XP de logros: {progress?.totalXpEarned ?? 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">Niveles</h2>
        <div className="mb-5 space-y-2">
          {series.levels.map((level) => {
            const unlocked = progress?.unlockedLevels.find(
              (item) => item.level === level.level
            );
            const color = RARITY_COLORS[level.rarity];
            return (
              <Card
                key={level.level}
                className={cn("transition-all", !unlocked && "opacity-60")}
                style={unlocked ? { borderColor: `${color}55` } : {}}
              >
                <CardContent className="flex items-center gap-4 py-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: unlocked ? `${color}20` : "#1e1e2e" }}
                  >
                    {unlocked ? (
                      <CheckCircle2 className="h-5 w-5 text-accent-emerald" />
                    ) : (
                      <Lock className="h-4 w-4 text-text-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">{level.label}</span>
                      <Badge style={{ background: `${color}18`, color, fontSize: "9px" }}>
                        {RARITY_LABELS[level.rarity]}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted">
                      Requiere {level.threshold} - recompensa {level.rewardType}
                    </p>
                    {unlocked && (
                      <p className="mt-0.5 text-[10px] text-text-muted">
                        Desbloqueado el{" "}
                        {format(new Date(unlocked.unlockedAt), "d 'de' MMMM yyyy", { locale: es })}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 font-mono text-sm font-bold" style={{ color }}>
                    +{level.xpReward} XP
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          className="mb-5 w-full"
          onClick={() =>
            navigate(
              series.relatedTemplateId
                ? `/register?template=${series.relatedTemplateId}`
                : "/register"
            )
          }
        >
          <PlusCircle className="h-4 w-4" />
          Registrar sesion relacionada
        </Button>

        <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">
          Historial de desbloqueos
        </h2>
        {progress?.unlockedLevels.length ? (
          <div className="mb-5 space-y-2">
            {progress.unlockedLevels.map((unlock) => {
              const level = series.levels.find((item) => item.level === unlock.level);
              return (
                <Card key={`${unlock.level}-${unlock.unlockedAt}`}>
                  <CardContent className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm text-text-primary">{level?.label ?? `Nivel ${unlock.level}`}</p>
                      <p className="text-xs text-text-muted">
                        {format(new Date(unlock.unlockedAt), "d MMM yyyy, HH:mm", { locale: es })}
                      </p>
                    </div>
                    <Badge variant="muted">{unlock.eventId}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mb-5">
            <CardContent className="py-4 text-sm text-text-muted">
              Todavia no hay niveles desbloqueados.
            </CardContent>
          </Card>
        )}

        {relatedEvents.length > 0 && (
          <>
            <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">
              Eventos que alimentan la metrica
            </h2>
            <div className="space-y-2">
              {relatedEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="flex items-center gap-3 py-2.5">
                    <span className="text-lg">{PROGRESS_EVENT_ICONS[event.type]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-text-primary">
                        {format(new Date(event.occurredAt), "d MMM yyyy", { locale: es })}
                      </p>
                      <p className="text-xs text-text-muted">{event.tags.join(", ")}</p>
                    </div>
                    <Badge variant="default">+{event.xpFromActivity} XP</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
