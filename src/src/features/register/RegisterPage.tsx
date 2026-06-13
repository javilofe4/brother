import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/app/store";
import { SESSION_TEMPLATES } from "@/shared/config/sessionTemplatesConfig";
import type { SessionTemplate, SessionFieldDefinition } from "@/domain/sessions/session.types";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import type { GamePipelineResult } from "@/domain/game/gamePipeline.service";
import { Button, Input, Label, Textarea, Select, Progress, cn } from "@/shared/components/ui";

// ── Template picker ────────────────────────────────────────────
function TemplatePicker({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {SESSION_TEMPLATES.map((t: SessionTemplate) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-150",
            selected === t.id
              ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-sm"
              : "border-[var(--bg-border)] bg-[var(--bg-surface)] hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)]"
          )}
        >
          <span className="text-2xl">{TEMPLATE_ICONS[t.id] ?? "🎯"}</span>
          <span className={cn(
            "text-xs font-medium leading-tight",
            selected === t.id ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
          )}>
            {t.title}
          </span>
        </button>
      ))}
    </div>
  );
}

const TEMPLATE_ICONS: Record<string, string> = {
  combat_session: "🥊",
  strength_session: "🏋️",
  swimming_session: "🏊",
  running_session: "🏃",
  walking_session: "🚶",
  route_session: "🗺️",
  finance_saving: "💰",
  finance_expense: "💸",
  finance_income: "💵",
  challenge_result: "⚔️",
  manual_action: "✍️",
};

// ── Dynamic form ───────────────────────────────────────────────
function SessionForm({ template, onSubmit, onCancel }: {
  template: SessionTemplate;
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({ intensity: "7" });
  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const relatedSeries = ACHIEVEMENT_CATALOG.filter(
    (s) => s.relatedTemplateId === template.id
  );

  const handleSubmit = () => {
    const missing = template.fields.filter((f: SessionFieldDefinition) => f.required && !values[f.key]);
    if (missing.length > 0) return;
    onSubmit(values);
  };

  return (
    <div className="rounded-xl border border-[var(--accent)] bg-[var(--bg-surface)] p-4 shadow-card animate-slide-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{TEMPLATE_ICONS[template.id] ?? "🎯"}</span>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{template.title}</p>
          {relatedSeries.length > 0 && (
            <p className="text-xs text-[var(--text-muted)]">
              Actualiza: {relatedSeries.map((s) => s.name).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Fecha</Label>
          <Input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>

        {template.fields.map((field: SessionFieldDefinition) => (
          <div key={field.key} className={field.type === "textarea" ? "col-span-2" : ""}>
            <Label>
              {field.label}
              {field.required && <span className="text-[var(--rose)] ml-1">*</span>}
            </Label>

            {field.type === "slider" && (
              <div>
                <input
                  type="range"
                  min={field.min ?? 1}
                  max={field.max ?? 10}
                  value={values[field.key] ?? "7"}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="w-full mt-1.5"
                  style={{ accentColor: "var(--accent)" }}
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                  <span>Suave</span>
                  <span className="font-bold text-[var(--accent)]">
                    {values[field.key] ?? "7"}/{field.max ?? 10}
                  </span>
                  <span>Máximo</span>
                </div>
              </div>
            )}
            {field.type === "number" && (
              <Input
                type="number"
                min={field.min}
                placeholder={field.placeholder}
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
            {field.type === "text" && (
              <Input
                placeholder={field.placeholder}
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
            {field.type === "select" && field.options && (
              <Select
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
              >
                <option value="">Selecciona...</option>
                {field.options.map((o: { value: string; label: string }) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            )}
            {field.type === "textarea" && (
              <Textarea
                placeholder={field.placeholder}
                rows={2}
                value={values[field.key] ?? ""}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="flex-1" onClick={handleSubmit}>Guardar sesión</Button>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────
function SuccessScreen({ result, template, onAnother, onDone }: {
  result: GamePipelineResult;
  template: SessionTemplate;
  onAnother: () => void;
  onDone: () => void;
}) {
  const unlocks = result.unlocks ?? [];

  return (
    <div className="rounded-2xl border border-[var(--emerald)] bg-[var(--emerald-light)] p-6 text-center animate-pop-in">
      <CheckCircle2 className="h-10 w-10 text-[var(--emerald)] mx-auto mb-3" />
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">¡Sesión registrada!</h2>
      <p className="text-3xl font-bold text-[var(--emerald)] mb-4">
        +{result.summary.totalXpAdded} XP
      </p>

      {unlocks.length > 0 && (
        <div className="space-y-2 mb-4">
          {unlocks.map((unlock, i: number) => (
            <div key={i} className="rounded-lg border border-[var(--gold)] bg-[var(--gold-light)] px-4 py-2">
              <p className="text-sm font-semibold text-[var(--gold)]">🏆 {unlock.series.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {unlock.level.label} desbloqueado · +{unlock.level.xpReward} XP
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onAnother}>Registrar otra</Button>
        <Button onClick={onDone}>Ir al inicio</Button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<{ r: GamePipelineResult; t: SessionTemplate } | null>(null);
  const registerSession = useAppStore((s) => s.registerSession);

  const template = selectedId
    ? SESSION_TEMPLATES.find((t: SessionTemplate) => t.id === selectedId) ?? null
    : null;

  const handleSubmit = (values: Record<string, string>) => {
    if (!template) return;
    const pipelineResult = registerSession({
      templateId: template.id,
      occurredAt: values.date
        ? new Date(values.date).toISOString()
        : new Date().toISOString(),
      durationMinutes: values.durationMinutes ? parseFloat(values.durationMinutes) : undefined,
      distanceKm: values.distanceKm ? parseFloat(values.distanceKm) : undefined,
      intensity: values.intensity ? parseInt(values.intensity) : undefined,
      amountEur: values.amountEur
        ? parseFloat(values.amountEur)
        : values.amount
        ? parseFloat(values.amount)
        : undefined,
      notes: values.notes,
      tags: [],
      fields: values as Record<string, unknown>,
    });
    setResult({ r: pipelineResult, t: template });
  };

  if (result) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-6 animate-fade-in">
          <SuccessScreen
            result={result.r}
            template={result.t}
            onAnother={() => { setResult(null); setSelectedId(null); }}
            onDone={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-lg mx-auto px-6 py-6 animate-fade-in">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Registrar</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">¿Qué hiciste hoy?</p>
        </div>

        <div className="mb-5">
          <TemplatePicker
            selected={selectedId}
            onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
          />
        </div>

        {template && (
          <SessionForm
            template={template}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
