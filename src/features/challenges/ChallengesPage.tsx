import { useState } from "react";
import { format, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { PlusCircle, Swords, CheckCircle2, Clock, XCircle, Trophy } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import type { Challenge } from "@/domain/challenges/challenge.types";
import { CHALLENGE_STATUS_LABELS, CHALLENGE_STATUS_COLORS } from "@/domain/challenges/challenge.types";
import {
  buildMissionInstances,
  currentMonthKey,
  computeUserMissionProgress,
  completedMissionCount,
  getMissionsForMonth,
} from "@/domain/monthlyMissions/monthlyMission.service";
import {
  Card, CardHeader, CardTitle, CardContent,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Button, Input, Label, Textarea, Select, Badge, Progress, cn,
} from "@/shared/components/ui";

// ── Missions tab ───────────────────────────────────────────────

function MissionsTab() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const getUserMetricValue = useAppStore((s) => s.getUserMetricValue);

  const month = currentMonthKey();
  const instances = buildMissionInstances(month);
  const definitions = getMissionsForMonth(month);
  const missionProgress = computeUserMissionProgress(
    instances, definitions,
    (metricId) => getUserMetricValue(activeUserId, metricId),
    activeUserId
  );
  const completed = completedMissionCount(missionProgress);
  const monthEnd = endOfMonth(new Date());
  const daysLeft = Math.ceil((monthEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-[var(--text-primary)] capitalize">
              {format(new Date(), "MMMM yyyy", { locale: es })}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {completed} de {instances.length} completadas · {daysLeft} días restantes
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{completed}/{instances.length}</p>
          </div>
        </div>
        <Progress value={(completed / instances.length) * 100} color="var(--emerald)" />
      </div>

      {/* Mission list */}
      {instances.map((inst, i) => {
        const def = definitions.find(d => d.id === inst.definitionId);
        const prog = missionProgress[i];
        if (!def || !prog) return null;
        const done = prog.currentValue >= prog.targetValue;
        const pct = Math.min(100, (prog.currentValue / prog.targetValue) * 100);
        return (
          <div
            key={inst.id}
            className={cn(
              "rounded-xl border p-4 shadow-card transition-all",
              done
                ? "border-[var(--emerald)] bg-[var(--emerald-light)]"
                : "border-[var(--bg-border)] bg-[var(--bg-surface)]"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {done
                  ? <CheckCircle2 className="h-5 w-5 text-[var(--emerald)]" />
                  : <div className="h-5 w-5 rounded-full border-2 border-[var(--bg-border)]" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-medium", done ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]")}>
                    {def.title}
                  </p>
                  <span className="text-xs font-semibold text-[var(--emerald)] flex-shrink-0">
                    +{def.rewardXp} XP
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{def.category}</p>
                {!done && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                      <span>{prog.currentValue} / {prog.targetValue}</span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <Progress value={pct} color="var(--emerald)" thin />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Challenge card ─────────────────────────────────────────────

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const respondToChallenge = useAppStore((s) => s.respondToChallenge);
  const completeChallenge = useAppStore((s) => s.completeChallenge);
  const cancelChallenge = useAppStore((s) => s.cancelChallenge);

  const color = CHALLENGE_STATUS_COLORS[challenge.status];
  const isForMe = challenge.assignedToUserId === activeUserId;
  const isMine = challenge.createdByUserId === activeUserId;
  const rival = USERS[isMine ? (challenge.assignedToUserId ?? (activeUserId === "javier" ? "rival" : "javier")) : challenge.createdByUserId];

  return (
    <div className="rounded-xl border bg-[var(--bg-surface)] p-4 shadow-card" style={{ borderColor: `${color}44` }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{challenge.title}</p>
          {challenge.description && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{challenge.description}</p>
          )}
        </div>
        <Badge style={{ background: `${color}18`, color, borderColor: `${color}30` }} className="flex-shrink-0 border">
          {CHALLENGE_STATUS_LABELS[challenge.status]}
        </Badge>
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <span>{rival.avatar}</span> {isMine ? `→ ${rival.name}` : `De ${rival.name}`}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(challenge.endsAt), "d MMM", { locale: es })}
        </span>
        <span className="font-semibold text-[var(--gold)]">+{challenge.rewardXp} XP</span>
      </div>

      {/* Actions */}
      {challenge.status === "sent" && isForMe && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="flex-1" onClick={() => respondToChallenge(challenge.id, true)}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Aceptar
          </Button>
          <Button size="sm" variant="danger" onClick={() => respondToChallenge(challenge.id, false)}>
            <XCircle className="h-3.5 w-3.5" /> Rechazar
          </Button>
        </div>
      )}
      {challenge.status === "active" && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="secondary" className="flex-1" onClick={() => completeChallenge(challenge.id, activeUserId)}>
            <Trophy className="h-3.5 w-3.5" /> Marcar completado
          </Button>
          {isMine && (
            <Button size="sm" variant="ghost" onClick={() => cancelChallenge(challenge.id)}>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ── New challenge form ─────────────────────────────────────────

function NewChallengeForm({ onClose }: { onClose: () => void }) {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const createChallenge = useAppStore((s) => s.createChallenge);
  const rivalId = activeUserId === "javier" ? "rival" : "javier";
  const rival = USERS[rivalId];

  const [form, setForm] = useState({
    title: "",
    description: "",
    rewardXp: "100",
    endsAt: "",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.endsAt) return;
    createChallenge({
      type: "direct",
      title: form.title,
      description: form.description,
      createdByUserId: activeUserId,
      assignedToUserId: rivalId,
      endsAt: new Date(form.endsAt).toISOString(),
      rewardXp: parseInt(form.rewardXp) || 100,
    });
    onClose();
  };

  return (
    <div className="rounded-xl border border-[var(--accent)] bg-[var(--bg-surface)] p-4 shadow-card animate-slide-in">
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Nuevo reto para {rival.avatar} {rival.name}
      </p>
      <div className="space-y-3">
        <div>
          <Label>Título del reto *</Label>
          <Input placeholder="Haz 4 sesiones de combate esta semana" value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div>
          <Label>Descripción</Label>
          <Textarea placeholder="Detalles del reto..." rows={2} value={form.description} onChange={e => set("description", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Fecha límite *</Label>
            <Input type="date" value={form.endsAt} onChange={e => set("endsAt", e.target.value)} />
          </div>
          <div>
            <Label>Recompensa XP</Label>
            <Input type="number" value={form.rewardXp} onChange={e => set("rewardXp", e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <Button className="flex-1" onClick={handleSubmit}><Swords className="h-4 w-4" />Lanzar reto</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

// ── Challenges tab ─────────────────────────────────────────────

function ChallengesTab() {
  const [showForm, setShowForm] = useState(false);
  const activeUserId = useAppStore((s) => s.activeUserId);
  const challenges = useAppStore((s) => s.challenges);

  const relevant = challenges.filter(
    c => c.createdByUserId === activeUserId || c.assignedToUserId === activeUserId
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const pending = relevant.filter(c => c.status === "sent" && c.assignedToUserId === activeUserId);
  const active  = relevant.filter(c => c.status === "active");
  const history = relevant.filter(c => ["completed","failed","rejected","cancelled","expired"].includes(c.status));

  return (
    <div className="space-y-4">
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)] mb-2">
            Pendientes de tu respuesta
          </p>
          <div className="space-y-2">
            {pending.map(c => <ChallengeCard key={c.id} challenge={c} />)}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Activos</p>
        <Button size="sm" variant="secondary" onClick={() => setShowForm(s => !s)}>
          <PlusCircle className="h-3.5 w-3.5" /> Nuevo
        </Button>
      </div>

      {showForm && <NewChallengeForm onClose={() => setShowForm(false)} />}

      {active.length === 0 && !showForm && (
        <div className="rounded-xl border border-dashed border-[var(--bg-border)] p-6 text-center">
          <Swords className="h-8 w-8 mx-auto mb-2 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-secondary)]">Sin retos activos</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Lanza uno a tu rival</p>
        </div>
      )}
      <div className="space-y-2">
        {active.map(c => <ChallengeCard key={c.id} challenge={c} />)}
      </div>

      {history.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Historial</p>
          <div className="space-y-2">
            {history.slice(0, 5).map(c => <ChallengeCard key={c.id} challenge={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export function ChallengesPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-6 animate-fade-in">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Retos</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Misiones del mes y duelos con tu rival</p>
        </div>

        <Tabs defaultValue="missions">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="missions">Misiones del mes</TabsTrigger>
            <TabsTrigger value="challenges">Retos del rival</TabsTrigger>
          </TabsList>
          <TabsContent value="missions"><MissionsTab /></TabsContent>
          <TabsContent value="challenges"><ChallengesTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
