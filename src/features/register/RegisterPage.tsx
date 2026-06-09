import { useMemo, useState } from "react";
import {
  Dumbbell,
  Wallet,
  Flag,
  Sparkles,
  CheckCircle,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { useAppStore } from "@/app/store";
import { buildProgressEvent, getXpForProgressEvent, PROGRESS_EVENT_LABELS } from "@/domain/progress/progress.service";
import type { ProgressEventType } from "@/domain/progress/progress.types";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent, Input, Label, Select, Textarea, Badge } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";
import { PROGRESS_XP_RULES } from "@/shared/config/scoringConfig";

const formTemplates: Record<ProgressEventType, { icon: React.ElementType; label: string }> = {
  workout_logged: { icon: Dumbbell, label: "Entrenamiento" },
  finance_logged: { icon: Wallet, label: "Finanzas" },
  challenge_created: { icon: Flag, label: "Crear reto" },
  challenge_completed: { icon: CheckCircle, label: "Completar reto" },
  challenge_failed: { icon: XCircle, label: "Reto fallido" },
  manual_action: { icon: Sparkles, label: "Acción manual" },
};

const financeCategories = [
  "salary",
  "profit",
  "debt",
  "fixed",
  "variable",
  "tax",
  "fun",
  "investment",
  "learning",
  "clothes",
  "other",
] as const;

export function RegisterPage() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const addProgressEvent = useAppStore((s) => s.addProgressEvent);
  const updateScore = useAppStore((s) => s.updateScore);
  const [activeTab, setActiveTab] = useState<ProgressEventType>("workout_logged");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(7);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState<typeof financeCategories[number]>("salary");
  const [manualXp, setManualXp] = useState(15);
  const [status, setStatus] = useState<"created" | "completed" | "failed">("created");
  const [feedback, setFeedback] = useState("");

  const xp = useMemo(
    () => getXpForProgressEvent(activeTab, {
      intensity,
      manualXp,
    }),
    [activeTab, intensity, manualXp]
  );

  const submitLabel = activeTab === "manual_action" ? "Registrar acción" : "Registrar progreso";

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      setFeedback("Completa el título y la descripción antes de guardar.");
      return;
    }

    const metadata: Record<string, unknown> = {
      category,
      intensity,
      amount,
      status,
    };

    const event = buildProgressEvent({
      id: `pe-${Date.now()}`,
      userId: activeUserId,
      type: activeTab,
      title: title.trim(),
      description: description.trim(),
      xp,
      metadata,
    });

    addProgressEvent(event);
    updateScore(activeUserId, xp);
    setFeedback(`Registrado: ${PROGRESS_EVENT_LABELS[activeTab]} (+${xp} XP)`);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Registrar progreso"
        subtitle="Registra acciones simples y gana XP para subir de nivel."
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Tipo de registro</CardTitle>
              <p className="text-sm text-text-muted">Selecciona una fuente de progreso.</p>
            </div>
            <Badge variant="default">XP base {xp}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as ProgressEventType)}>
            <TabsList>
              {Object.entries(formTemplates).map(([key, item]) => (
                <TabsTrigger key={key} value={key}>
                  <item.icon className="h-4 w-4" /> {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(formTemplates).map(([key, item]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder={item.label}
                      />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        rows={4}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="¿Qué hiciste y por qué cuenta como progreso?"
                      />
                    </div>

                    {key === "workout_logged" && (
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <Label>Intensidad</Label>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            value={intensity}
                            onChange={(event) => setIntensity(Number(event.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Duración (min)</Label>
                          <Input
                            type="number"
                            value={amount}
                            onChange={(event) => setAmount(Number(event.target.value))}
                            placeholder="30"
                          />
                        </div>
                      </div>
                    )}

                    {key === "finance_logged" && (
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <Label>Categoría</Label>
                          <Select value={category} onChange={(event) => setCategory(event.target.value as typeof financeCategories[number])}>
                            {financeCategories.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <Label>Importe</Label>
                          <Input
                            type="number"
                            value={amount}
                            onChange={(event) => setAmount(Number(event.target.value))}
                            placeholder="100"
                          />
                        </div>
                      </div>
                    )}

                    {key.startsWith("challenge") && (
                      <div>
                        <Label>Resultado</Label>
                        <Select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                          <option value="created">Creado</option>
                          <option value="completed">Completado</option>
                          <option value="failed">Fallado</option>
                        </Select>
                      </div>
                    )}

                    {key === "manual_action" && (
                      <div>
                        <Label>XP deseado</Label>
                        <Input
                          type="number"
                          min={0}
                          max={PROGRESS_XP_RULES.manualActionMax}
                          value={manualXp}
                          onChange={(event) => setManualXp(Number(event.target.value))}
                        />
                        <p className="text-xs text-text-muted mt-1">Máximo {PROGRESS_XP_RULES.manualActionMax} XP.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Card className="bg-bg-elevated border border-bg-border p-4">
                      <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Resumen</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-text-secondary">
                          <span>Tipo</span>
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-text-secondary">
                          <span>XP estimado</span>
                          <span className="font-medium">{xp}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-text-secondary">
                          <span>Regla</span>
                          <span>{PROGRESS_EVENT_LABELS[activeTab]}</span>
                        </div>
                      </div>
                    </Card>

                    <Button className="w-full" onClick={handleSubmit}>
                      <PlusCircle className="h-4 w-4" />
                      {submitLabel}
                    </Button>

                    {feedback && (
                      <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 p-3 text-sm text-text-primary">
                        {feedback}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
