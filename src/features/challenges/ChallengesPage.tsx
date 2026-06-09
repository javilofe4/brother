import { useState } from "react";
import { PlusCircle, Swords, CheckCircle2, XCircle, Clock } from "lucide-react";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { USERS, type UserId } from "@/domain/users/user.types";
import {
  ChallengeTypeEnum,
  CHALLENGE_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  type ChallengeType,
  type ChallengeStatus,
} from "@/domain/challenges/challenge.types";
import {
  Card, CardHeader, CardTitle, CardContent, Button, Input, Label, Select, Textarea, Badge, Progress,
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";

function ChallengeForm({ onClose }: { onClose: () => void }) {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const addChallenge = useAppStore((s) => s.addChallenge);
  const otherUser = activeUserId === "javier" ? "rival" : "javier";

  const [form, setForm] = useState({
    title: "",
    type: "workout_count" as ChallengeType,
    targetValue: "",
    unit: "",
    points: "50",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title || !form.targetValue || !form.endDate) return;

    addChallenge({
      id: uuid(),
      createdBy: activeUserId,
      targetUser: otherUser as UserId,
      title: form.title,
      type: form.type,
      targetValue: parseFloat(form.targetValue),
      unit: form.unit || CHALLENGE_TYPE_LABELS[form.type],
      points: parseInt(form.points),
      startDate: form.startDate,
      endDate: form.endDate,
      status: "proposed",
      currentValue: 0,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Card className="border-accent-violet/30 animate-slide-in">
      <CardHeader>
        <CardTitle>Nuevo reto para {USERS[otherUser as UserId].name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Título del reto *</Label>
            <Input
              placeholder="Ej: 10 entrenamientos en enero"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
              {ChallengeTypeEnum.options.map((t) => (
                <option key={t} value={t}>{CHALLENGE_TYPE_LABELS[t]}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Valor objetivo *</Label>
            <Input
              type="number"
              placeholder="10"
              value={form.targetValue}
              onChange={(e) => set("targetValue", e.target.value)}
            />
          </div>

          <div>
            <Label>Unidad</Label>
            <Input
              placeholder="entrenamientos, km, €..."
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
            />
          </div>

          <div>
            <Label>Puntos en juego</Label>
            <Input
              type="number"
              value={form.points}
              onChange={(e) => set("points", e.target.value)}
            />
          </div>

          <div>
            <Label>Fecha inicio</Label>
            <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </div>

          <div>
            <Label>Fecha límite *</Label>
            <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </div>

          <div className="col-span-2">
            <Label>Notas</Label>
            <Textarea placeholder="Reglas adicionales..." rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="violet" onClick={handleSubmit} className="flex-1">
            <Swords className="h-4 w-4" /> Lanzar reto
          </Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ChallengeCard({ ch }: { ch: ReturnType<typeof useAppStore.getState>["challenges"][0] }) {
  const updateChallengeStatus = useAppStore((s) => s.updateChallengeStatus);
  const updateScore = useAppStore((s) => s.updateScore);
  const activeUserId = useAppStore((s) => s.activeUserId);

  const pct = ch.targetValue > 0 ? Math.min(100, (ch.currentValue / ch.targetValue) * 100) : 0;
  const color = STATUS_COLORS[ch.status];

  const accept = () => updateChallengeStatus(ch.id, "accepted");
  const complete = () => {
    updateChallengeStatus(ch.id, "completed", ch.targetValue);
    updateScore(activeUserId, ch.points);
  };
  const fail = () => {
    updateChallengeStatus(ch.id, "failed");
    updateScore(activeUserId, -10);
  };

  return (
    <Card className="border-l-2 hover:border-l-2 transition-all" style={{ borderLeftColor: color }}>
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-medium text-text-primary text-sm">{ch.title}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {USERS[ch.createdBy].name} → {USERS[ch.targetUser].name}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge variant="amber">{ch.points}pts</Badge>
            <Badge style={{ background: `${color}20`, color }}>
              {STATUS_LABELS[ch.status]}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>{ch.currentValue} / {ch.targetValue} {ch.unit}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(ch.endDate), "d MMM", { locale: es })}
          </span>
        </div>

        {ch.status === "accepted" && (
          <>
            <Progress value={pct} color={color} />
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={complete} className="flex-1">
                <CheckCircle2 className="h-3 w-3" /> Completar
              </Button>
              <Button size="sm" variant="danger" onClick={fail}>
                <XCircle className="h-3 w-3" /> Fallar
              </Button>
            </div>
          </>
        )}

        {ch.status === "proposed" && ch.targetUser === activeUserId && (
          <Button size="sm" variant="violet" onClick={accept} className="w-full mt-3">
            Aceptar reto
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ChallengesPage() {
  const [showForm, setShowForm] = useState(false);
  const activeUserId = useAppStore((s) => s.activeUserId);
  const challenges = useAppStore((s) => s.challenges);

  const filterByStatus = (status: ChallengeStatus) =>
    challenges.filter(
      (c) =>
        (c.createdBy === activeUserId || c.targetUser === activeUserId) &&
        c.status === status
    );

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Retos"
        subtitle="Desafía a tu rival"
        action={
          !showForm && (
            <Button variant="violet" onClick={() => setShowForm(true)}>
              <Swords className="h-4 w-4" /> Nuevo reto
            </Button>
          )
        }
      />

      {showForm && <ChallengeForm onClose={() => setShowForm(false)} />}

      <Tabs defaultValue="accepted" className="mt-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="accepted">Activos ({filterByStatus("accepted").length})</TabsTrigger>
          <TabsTrigger value="proposed">Propuestos ({filterByStatus("proposed").length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({filterByStatus("completed").length})</TabsTrigger>
          <TabsTrigger value="failed">Fallidos ({filterByStatus("failed").length})</TabsTrigger>
        </TabsList>

        {(["accepted", "proposed", "completed", "failed"] as ChallengeStatus[]).map((status) => (
          <TabsContent key={status} value={status}>
            <div className="space-y-3">
              {filterByStatus(status).length === 0 ? (
                <Card className="text-center py-10">
                  <Swords className="h-10 w-10 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted text-sm">No hay retos {STATUS_LABELS[status].toLowerCase()}</p>
                </Card>
              ) : (
                filterByStatus(status).map((ch) => <ChallengeCard key={ch.id} ch={ch} />)
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
