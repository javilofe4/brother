import { useState } from "react";
import { PlusCircle, Dumbbell, Clock, Zap } from "lucide-react";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import {
  WorkoutTypeEnum,
  WORKOUT_LABELS,
  WORKOUT_ICONS,
  type WorkoutType,
} from "@/domain/workouts/workout.types";
import { calculateWorkoutPoints } from "@/domain/scoring/scoring.types";
import {
  Card, CardHeader, CardTitle, CardContent,
  Button, Input, Label, Select, Textarea, Badge, Progress,
} from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";

function WorkoutForm({ onClose }: { onClose: () => void }) {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const addWorkout = useAppStore((s) => s.addWorkout);
  const updateScore = useAppStore((s) => s.updateScore);

  const [form, setForm] = useState({
    type: "running" as WorkoutType,
    durationMinutes: "",
    distanceKm: "",
    weightKg: "",
    reps: "",
    intensity: "7",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const dur = parseInt(form.durationMinutes);
    const int = parseInt(form.intensity);
    if (!dur || !int) return;

    const workout = {
      id: uuid(),
      userId: activeUserId,
      type: form.type,
      durationMinutes: dur,
      intensity: int,
      date: form.date,
      createdAt: new Date().toISOString(),
      ...(form.distanceKm ? { distanceKm: parseFloat(form.distanceKm) } : {}),
      ...(form.weightKg ? { weightKg: parseFloat(form.weightKg) } : {}),
      ...(form.reps ? { reps: parseInt(form.reps) } : {}),
      ...(form.notes ? { notes: form.notes } : {}),
    };

    addWorkout(workout);
    updateScore(activeUserId, calculateWorkoutPoints(int));
    onClose();
  };

  return (
    <Card className="border-accent-cyan/30 animate-slide-in">
      <CardHeader>
        <CardTitle>Nuevo entrenamiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <Label>Tipo</Label>
            <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
              {WorkoutTypeEnum.options.map((t) => (
                <option key={t} value={t}>
                  {WORKOUT_ICONS[t]} {WORKOUT_LABELS[t]}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>

          <div>
            <Label>Duración (min) *</Label>
            <Input
              type="number"
              placeholder="45"
              value={form.durationMinutes}
              onChange={(e) => set("durationMinutes", e.target.value)}
            />
          </div>

          <div>
            <Label>Intensidad (1-10) *</Label>
            <Input
              type="range"
              min="1"
              max="10"
              value={form.intensity}
              onChange={(e) => set("intensity", e.target.value)}
              className="h-2 mt-3"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>Fácil</span>
              <span className="font-mono font-bold text-accent-cyan">{form.intensity}/10</span>
              <span>Máximo</span>
            </div>
          </div>

          <div>
            <Label>Distancia (km)</Label>
            <Input
              type="number"
              placeholder="0"
              step="0.1"
              value={form.distanceKm}
              onChange={(e) => set("distanceKm", e.target.value)}
            />
          </div>

          <div>
            <Label>Peso (kg)</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.weightKg}
              onChange={(e) => set("weightKg", e.target.value)}
            />
          </div>

          <div>
            <Label>Repeticiones</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.reps}
              onChange={(e) => set("reps", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Notas</Label>
            <Textarea
              placeholder="Cómo fue el entrenamiento..."
              rows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        {/* Points preview */}
        {form.intensity && (
          <div className="mt-3 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent-cyan" />
            <span className="text-xs text-text-secondary">
              Ganarás{" "}
              <strong className="text-accent-cyan">
                +{calculateWorkoutPoints(parseInt(form.intensity))} puntos
              </strong>
              {parseInt(form.intensity) >= 8 && " (bonus intensidad alta!)"}
            </span>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button onClick={handleSubmit} className="flex-1">
            <PlusCircle className="h-4 w-4" /> Registrar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkoutsPage() {
  const [showForm, setShowForm] = useState(false);
  const activeUserId = useAppStore((s) => s.activeUserId);
  const workouts = useAppStore((s) =>
    s.workouts.filter((w) => w.userId === activeUserId && !w.deletedAt)
  );

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader
        title="Entrenamientos"
        subtitle={`${workouts.length} sesiones registradas`}
        action={
          !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4" /> Nuevo
            </Button>
          )
        }
      />

      {showForm && <WorkoutForm onClose={() => setShowForm(false)} />}

      <div className="mt-6 space-y-3">
        {workouts.length === 0 && (
          <Card className="text-center py-12">
            <Dumbbell className="h-12 w-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">No hay entrenamientos registrados</p>
          </Card>
        )}
        {workouts.map((w) => (
          <Card key={w.id} glow="none" className="flex items-center gap-4 group hover:border-accent-cyan/30 transition-colors">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl flex-shrink-0"
              style={{ background: "#00e5ff15", border: "1px solid #00e5ff20" }}
            >
              {WORKOUT_ICONS[w.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-text-primary text-sm">
                  {WORKOUT_LABELS[w.type]}
                </span>
                <Badge variant={w.intensity >= 8 ? "rose" : w.intensity >= 6 ? "amber" : "muted"}>
                  {w.intensity}/10
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {w.durationMinutes}min
                </span>
                {w.distanceKm && <span>📍 {w.distanceKm}km</span>}
                {w.weightKg && <span>⚖️ {w.weightKg}kg</span>}
                {w.reps && <span>🔁 {w.reps} reps</span>}
                <span>{format(new Date(w.date), "d MMM", { locale: es })}</span>
              </div>
              {w.notes && (
                <p className="text-xs text-text-muted mt-1 truncate">{w.notes}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-mono font-bold text-accent-cyan text-sm">
                +{calculateWorkoutPoints(w.intensity)}
              </p>
              <p className="text-[10px] text-text-muted">pts</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
