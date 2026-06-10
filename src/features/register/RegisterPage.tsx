import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Zap } from "lucide-react";
import { useAppStore } from "@/app/store";
import { SESSION_TEMPLATES } from "@/shared/config/sessionTemplatesConfig";
import type { SessionTemplate } from "@/domain/sessions/session.types";
import { TAG_BY_ID } from "@/domain/tags/tagCatalog";
import type { TagId } from "@/domain/tags/tag.types";
import { ACHIEVEMENT_CATALOG } from "@/domain/achievements/achievementCatalog";
import type { GamePipelineResult } from "@/domain/game/gamePipeline.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
  cn,
} from "@/shared/components/ui";

const TEMPLATE_VISUALS: Record<SessionTemplate["id"], { icon: string; color: string }> = {
  combat_session: { icon: "🥊", color: "#f43f5e" },
  strength_session: { icon: "🏋️", color: "#7c3aed" },
  swimming_session: { icon: "🏊", color: "#00e5ff" },
  running_session: { icon: "🏃", color: "#10b981" },
  walking_session: { icon: "🚶", color: "#22c55e" },
  route_session: { icon: "🗺️", color: "#f59e0b" },
  finance_saving: { icon: "💰", color: "#10b981" },
  finance_expense: { icon: "💸", color: "#f43f5e" },
  finance_income: { icon: "💵", color: "#00e5ff" },
  challenge_result: { icon: "🏆", color: "#f59e0b" },
  manual_action: { icon: "✍️", color: "#8888aa" },
};

function TemplateGrid({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: SessionTemplate["id"]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {SESSION_TEMPLATES.map((template) => {
        const visual = TEMPLATE_VISUALS[template.id];
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              "flex min-h-24 flex-col items-start justify-between rounded-lg border p-3 text-left transition-all",
              selected === template.id
                ? "scale-[0.98] bg-bg-elevated"
                : "border-bg-border bg-bg-card hover:border-bg-border/80"
            )}
            style={selected === template.id ? { borderColor: visual.color } : {}}
          >
            <span className="text-2xl">{visual.icon}</span>
            <span className="text-sm font-semibold text-text-primary">{template.title}</span>
            <span className="line-clamp-2 text-xs text-text-muted">{template.description}</span>
          </button>
        );
      })}
    </div>
  );
}

function parseFieldValue(value: string): unknown {
  if (value === "") return undefined;
  const maybeNumber = Number(value);
  return Number.isFinite(maybeNumber) && value.trim() !== "" ? maybeNumber : value;
}

function SessionForm({
  template,
  onSubmit,
  onCancel,
}: {
  template: SessionTemplate;
  onSubmit: (values: Record<string, string>, selectedTags: TagId[]) => void;
  onCancel: () => void;
}) {
  const visual = TEMPLATE_VISUALS[template.id];
  const [values, setValues] = useState<Record<string, string>>({
    date: new Date().toISOString().slice(0, 10),
    intensity: template.fields.some((field) => field.key === "intensity") ? "7" : "",
  });
  const [selectedTags, setSelectedTags] = useState<TagId[]>([]);

  const relatedSeries = useMemo(
    () => ACHIEVEMENT_CATALOG.filter((series) => series.relatedTemplateId === template.id),
    [template.id]
  );

  const set = (key: string, value: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = () => {
    const missing = template.fields.some(
      (field) => field.required && !values[field.key]
    );
    if (missing) return;
    onSubmit(values, selectedTags);
  };

  return (
    <Card className="animate-slide-in" style={{ borderColor: `${visual.color}55` }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl"
            style={{ background: `${visual.color}20` }}
          >
            {visual.icon}
          </div>
          <div>
            <CardTitle style={{ color: visual.color }}>{template.title}</CardTitle>
            {relatedSeries.length > 0 && (
              <p className="mt-0.5 text-[10px] text-text-muted">
                Actualiza: {relatedSeries.slice(0, 4).map((series) => series.name).join(", ")}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={values.date}
              onChange={(event) => set("date", event.target.value)}
            />
          </div>

          {template.fields.map((field) => (
            <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <Label>
                {field.label}
                {field.required && <span className="ml-1 text-accent-rose">*</span>}
              </Label>

              {field.type === "slider" && (
                <div>
                  <input
                    type="range"
                    min={field.min ?? 1}
                    max={field.max ?? 10}
                    value={values[field.key] ?? "7"}
                    onChange={(event) => set(field.key, event.target.value)}
                    className="mt-2 w-full"
                    style={{ accentColor: visual.color }}
                  />
                  <div className="mt-1 flex justify-between text-xs text-text-muted">
                    <span>1</span>
                    <span className="font-mono font-bold" style={{ color: visual.color }}>
                      {values[field.key] ?? "7"}/{field.max ?? 10}
                    </span>
                    <span>{field.max ?? 10}</span>
                  </div>
                </div>
              )}

              {field.type === "number" && (
                <Input
                  type="number"
                  min={field.min}
                  max={field.max}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(event) => set(field.key, event.target.value)}
                />
              )}

              {field.type === "text" && (
                <Input
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(event) => set(field.key, event.target.value)}
                />
              )}

              {field.type === "select" && (
                <Select
                  value={values[field.key] ?? ""}
                  onChange={(event) => set(field.key, event.target.value)}
                >
                  <option value="">Selecciona...</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}

              {field.type === "textarea" && (
                <Textarea
                  rows={2}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(event) => set(field.key, event.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {template.allowedTags.length > 0 && (
          <div className="mb-4">
            <Label>Tags permitidos</Label>
            <div className="flex flex-wrap gap-2">
              {template.allowedTags.map((tagId) => {
                const active = selectedTags.includes(tagId);
                const tag = TAG_BY_ID[tagId];
                return (
                  <button
                    key={tagId}
                    onClick={() =>
                      setSelectedTags((previous) =>
                        active
                          ? previous.filter((item) => item !== tagId)
                          : [...previous, tagId]
                      )
                    }
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs transition-all",
                      active
                        ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                        : "border-bg-border text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="flex-1" style={{ background: visual.color }}>
            <Zap className="h-4 w-4" />
            Registrar sesion
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SuccessCard({
  result,
  onAnother,
  onDone,
}: {
  result: GamePipelineResult;
  onAnother: () => void;
  onDone: () => void;
}) {
  const template = SESSION_TEMPLATES.find((item) => item.id === result.session.templateId);
  const visual = template ? TEMPLATE_VISUALS[template.id] : TEMPLATE_VISUALS.manual_action;

  return (
    <Card className="animate-fade-in py-10 text-center" style={{ borderColor: `${visual.color}55` }}>
      <CardContent>
        <div className="mb-3 text-5xl">{visual.icon}</div>
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-accent-emerald" />
        <h2 className="mb-1 font-display text-2xl text-text-primary">Sesion registrada</h2>
        <p className="mb-3 font-display text-4xl" style={{ color: visual.color }}>
          +{result.summary.totalXpAdded} XP
        </p>

        <div className="mx-auto mb-4 max-w-sm space-y-2 text-left">
          <div className="rounded-lg border border-bg-border bg-bg-elevated px-4 py-2 text-sm text-text-secondary">
            +{result.summary.activityXp} XP por actividad
          </div>
          {result.unlocks.map((unlock) => (
            <div
              key={`${unlock.series.id}-${unlock.level.level}`}
              className="rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-4 py-2"
            >
              <p className="text-sm font-medium text-accent-amber">Logro desbloqueado</p>
              <p className="text-xs text-text-secondary">
                {unlock.series.name} - {unlock.level.label} (+{unlock.level.xpReward} XP)
              </p>
            </div>
          ))}
          {result.unlocks.length === 0 && (
            <Badge variant="muted">Metricas actualizadas sin nuevos desbloqueos</Badge>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={onAnother} variant="secondary">
            Registrar otra
          </Button>
          <Button onClick={onDone}>Ir al Dashboard</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateFromUrl = searchParams.get("template");
  const initialTemplate = SESSION_TEMPLATES.some((template) => template.id === templateFromUrl)
    ? templateFromUrl
    : null;
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(initialTemplate);
  const [result, setResult] = useState<GamePipelineResult | null>(null);
  const activeUserId = useAppStore((state) => state.activeUserId);
  const registerSession = useAppStore((state) => state.registerSession);

  const template = selectedTemplateId
    ? SESSION_TEMPLATES.find((item) => item.id === selectedTemplateId)
    : null;

  const handleSubmit = (values: Record<string, string>, selectedTags: TagId[]) => {
    if (!template) return;
    const fields = Object.fromEntries(
      Object.entries(values)
        .filter(([key]) => key !== "date")
        .map(([key, value]) => [key, parseFieldValue(value)])
        .filter(([, value]) => value !== undefined)
    );
    const pipelineResult = registerSession({
      userId: activeUserId,
      templateId: template.id,
      occurredAt: values.date ? new Date(`${values.date}T12:00:00`).toISOString() : undefined,
      tags: selectedTags,
      fields,
    });
    setResult(pipelineResult);
  };

  if (result) {
    return (
      <div className="max-w-lg p-6">
        <SuccessCard
          result={result}
          onAnother={() => {
            setResult(null);
            setSelectedTemplateId(null);
          }}
          onDone={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 animate-fade-in">
      <div className="mb-6">
        <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">Registrar</p>
        <h1 className="font-display text-4xl tracking-wide text-text-primary">Nueva sesion</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Cada registro crea una Session, un ProgressEvent, snapshots, logros y XP.
        </p>
      </div>

      <div className="max-w-3xl">
        <h2 className="mb-3 text-xs uppercase tracking-widest text-text-muted">
          Tipo de sesion
        </h2>
        <TemplateGrid
          selected={selectedTemplateId}
          onSelect={(id) => setSelectedTemplateId(id)}
        />

        {template && (
          <div className="mt-5">
            <SessionForm
              template={template}
              onSubmit={handleSubmit}
              onCancel={() => setSelectedTemplateId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
