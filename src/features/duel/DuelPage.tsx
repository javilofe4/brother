import { subDays, startOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";
import { Trophy, Flame, Star, Dumbbell } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { getLevelFromXp } from "@/shared/config/xpConfig";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import { Card, CardContent, CardHeader, CardTitle, Progress } from "@/shared/components/ui";

function StatRow({
  label,
  valA,
  valB,
  numA,
  numB,
  colorA,
  colorB,
}: {
  label: string;
  valA: string;
  valB: string;
  numA: number;
  numB: number;
  colorA: string;
  colorB: string;
}) {
  const max = Math.max(numA, numB, 1);
  const winA = numA > numB;
  const winB = numB > numA;
  return (
    <div className="py-2.5 border-b border-[var(--bg-border)] last:border-0">
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5 text-center">{label}</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center justify-end gap-1.5">
          {winA && <span className="text-[var(--gold)] text-xs">👑</span>}
          <span className="font-bold font-mono text-sm" style={{ color: winA ? colorA : "var(--text-muted)" }}>
            {valA}
          </span>
        </div>
        <div className="relative flex gap-0.5 w-32">
          <div className="flex-1 overflow-hidden rounded-l-full bg-[var(--bg-elevated)] h-2 flex justify-end">
            <div
              className="h-full rounded-l-full"
              style={{ width: `${(numA / max) * 100}%`, background: colorA }}
            />
          </div>
          <div className="w-px bg-[var(--bg-border)]" />
          <div className="flex-1 overflow-hidden rounded-r-full bg-[var(--bg-elevated)] h-2">
            <div
              className="h-full rounded-r-full"
              style={{ width: `${(numB / max) * 100}%`, background: colorB }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold font-mono text-sm" style={{ color: winB ? colorB : "var(--text-muted)" }}>
            {valB}
          </span>
          {winB && <span className="text-[var(--gold)] text-xs">👑</span>}
        </div>
      </div>
    </div>
  );
}

export function DuelPage() {
  const events = useAppStore((s) => s.progressEvents);
  const getUserTotalXp = useAppStore((s) => s.getUserTotalXp);
  const getUserAchievementProgress = useAppStore((s) => s.getUserAchievementProgress);
  const getStreak = useAppStore((s) => s.getStreak);

  const xpJ = getUserTotalXp("javier");
  const xpR = getUserTotalXp("rival");
  const lvlJ = getLevelFromXp(xpJ);
  const lvlR = getLevelFromXp(xpR);
  const streakJ = getStreak("javier");
  const streakR = getStreak("rival");

  const weekStart = subDays(new Date(), 7).toISOString();
  const monthStart = startOfMonth(new Date()).toISOString();

  const weekXpJ = events.filter((e) => e.userId === "javier" && e.occurredAt >= weekStart).reduce((s, e) => s + e.xpFromActivity, 0);
  const weekXpR = events.filter((e) => e.userId === "rival" && e.occurredAt >= weekStart).reduce((s, e) => s + e.xpFromActivity, 0);
  const monthXpJ = events.filter((e) => e.userId === "javier" && e.occurredAt >= monthStart).reduce((s, e) => s + e.xpFromActivity, 0);
  const monthXpR = events.filter((e) => e.userId === "rival" && e.occurredAt >= monthStart).reduce((s, e) => s + e.xpFromActivity, 0);

  const progJ = getUserAchievementProgress("javier");
  const progR = getUserAchievementProgress("rival");
  const achJ = progJ.filter((p) => p.currentLevel > 0).length;
  const achR = progR.filter((p) => p.currentLevel > 0).length;
  const maxedJ = progJ.filter((p) => {
    const s = ACHIEVEMENT_CATALOG.find((x) => x.id === p.seriesId);
    return s && p.currentLevel >= s.levels.length;
  }).length;
  const maxedR = progR.filter((p) => {
    const s = ACHIEVEMENT_CATALOG.find((x) => x.id === p.seriesId);
    return s && p.currentLevel >= s.levels.length;
  }).length;

  const sessJ = events.filter((e) => e.userId === "javier").length;
  const sessR = events.filter((e) => e.userId === "rival").length;

  const maxXp = Math.max(xpJ, xpR, 1);
  const javier = USERS.javier;
  const rival = USERS.rival;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-lg mx-auto px-6 py-6 animate-fade-in">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Duelo</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {format(new Date(), "MMMM yyyy", { locale: es })}
          </p>
        </div>

        {/* VS Hero */}
        <div className="rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-5 shadow-card mb-5">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Javier */}
            <div className="text-center">
              <div
                className="h-14 w-14 rounded-2xl mx-auto mb-2 flex items-center justify-center text-2xl"
                style={{ background: `${javier.color}15`, border: `2px solid ${javier.color}44` }}
              >
                {javier.avatar}
              </div>
              <p className="font-semibold text-sm text-[var(--text-primary)]">{javier.name}</p>
              <p className="text-xs mt-0.5" style={{ color: lvlJ.levelConfig.color }}>
                {lvlJ.levelConfig.icon} Nv.{lvlJ.level}
              </p>
              <p className="font-bold font-mono text-sm mt-1" style={{ color: javier.color }}>
                {xpJ.toLocaleString()} XP
              </p>
            </div>

            {/* VS */}
            <div className="text-center">
              <p className="text-2xl font-black text-[var(--text-muted)] tracking-wider">VS</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Δ {Math.abs(xpJ - xpR).toLocaleString()} XP
              </p>
            </div>

            {/* Rival */}
            <div className="text-center">
              <div
                className="h-14 w-14 rounded-2xl mx-auto mb-2 flex items-center justify-center text-2xl"
                style={{ background: `${rival.color}15`, border: `2px solid ${rival.color}44` }}
              >
                {rival.avatar}
              </div>
              <p className="font-semibold text-sm text-[var(--text-primary)]">{rival.name}</p>
              <p className="text-xs mt-0.5" style={{ color: lvlR.levelConfig.color }}>
                {lvlR.levelConfig.icon} Nv.{lvlR.level}
              </p>
              <p className="font-bold font-mono text-sm mt-1" style={{ color: rival.color }}>
                {xpR.toLocaleString()} XP
              </p>
            </div>
          </div>

          {/* XP bars */}
          <div className="mt-4 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>{javier.name}</span>
                <span>{rival.name}</span>
              </div>
              <div className="flex gap-0.5 h-2">
                <div
                  className="rounded-l-full"
                  style={{ width: `${(xpJ / (xpJ + xpR + 1)) * 100}%`, background: javier.color, minWidth: "4px" }}
                />
                <div
                  className="rounded-r-full flex-1"
                  style={{ background: rival.color }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats comparison */}
        <Card className="mb-5">
          <CardHeader><CardTitle>Comparativa detallada</CardTitle></CardHeader>
          <CardContent>
            <StatRow label="XP Total" valA={xpJ.toLocaleString()} valB={xpR.toLocaleString()} numA={xpJ} numB={xpR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="XP esta semana" valA={weekXpJ.toString()} valB={weekXpR.toString()} numA={weekXpJ} numB={weekXpR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="XP este mes" valA={monthXpJ.toString()} valB={monthXpR.toString()} numA={monthXpJ} numB={monthXpR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="Racha (días)" valA={`${streakJ}d`} valB={`${streakR}d`} numA={streakJ} numB={streakR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="Logros desbloqueados" valA={achJ.toString()} valB={achR.toString()} numA={achJ} numB={achR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="Series completadas" valA={maxedJ.toString()} valB={maxedR.toString()} numA={maxedJ} numB={maxedR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="Sesiones totales" valA={sessJ.toString()} valB={sessR.toString()} numA={sessJ} numB={sessR} colorA={javier.color} colorB={rival.color} />
            <StatRow label="Nivel" valA={`Nv.${lvlJ.level}`} valB={`Nv.${lvlR.level}`} numA={lvlJ.level} numB={lvlR.level} colorA={javier.color} colorB={rival.color} />
          </CardContent>
        </Card>

        {/* Achievement series comparison */}
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Progreso por serie</h2>
        <div className="space-y-2">
          {ACHIEVEMENT_CATALOG.slice(0, 8).map((series) => {
            const pJ = progJ.find((p) => p.seriesId === series.id);
            const pR = progR.find((p) => p.seriesId === series.id);
            const maxVal = series.levels[series.levels.length - 1]?.threshold ?? 1;
            const vJ = pJ?.currentValue ?? 0;
            const vR = pR?.currentValue ?? 0;
            return (
              <div key={series.id} className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-3 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{series.icon}</span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">{series.name}</span>
                  <span className="ml-auto text-[10px] text-[var(--text-muted)]">
                    Nv.{pJ?.currentLevel ?? 0} vs Nv.{pR?.currentLevel ?? 0}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_4px_1fr] items-center gap-1">
                  <div className="flex justify-end overflow-hidden rounded-l-full bg-[var(--bg-elevated)] h-1.5">
                    <div className="h-full rounded-l-full" style={{ width: `${(vJ / maxVal) * 100}%`, background: javier.color }} />
                  </div>
                  <div className="bg-[var(--bg-border)] h-2 w-px" />
                  <div className="overflow-hidden rounded-r-full bg-[var(--bg-elevated)] h-1.5">
                    <div className="h-full rounded-r-full" style={{ width: `${(vR / maxVal) * 100}%`, background: rival.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
