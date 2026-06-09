import { useState } from "react";
import { RefreshCw, Database, CheckCircle2, User } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS, type UserId } from "@/domain/users/user.types";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@/shared/components/ui";
import { PageHeader } from "@/shared/components/PageHeader";
import { cn } from "@/shared/components/ui";

export function SettingsPage() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const workouts = useAppStore((s) => s.workouts);
  const finances = useAppStore((s) => s.finances);
  const challenges = useAppStore((s) => s.challenges);

  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done">("idle");

  const handleSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => setSyncStatus("done"), 2000);
    setTimeout(() => setSyncStatus("idle"), 4000);
  };

  return (
    <div className="p-6 animate-fade-in">
      <PageHeader title="Ajustes" subtitle="Configuración de la app" />

      <div className="max-w-lg space-y-4">
        {/* User selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-accent-cyan" />
              <CardTitle>Usuario activo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-text-muted mb-3">
              Selecciona quién está usando la app ahora mismo
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.values(USERS) as typeof USERS[UserId][]).map((user) => {
                const isActive = user.id === activeUserId;
                return (
                  <button
                    key={user.id}
                    onClick={() => setActiveUserId(user.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200",
                      isActive
                        ? "border-current bg-current/10"
                        : "border-bg-border bg-bg-elevated hover:border-bg-card"
                    )}
                    style={isActive ? { borderColor: user.color, backgroundColor: `${user.color}10` } : {}}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl"
                      style={{
                        background: `${user.color}20`,
                        border: `1px solid ${user.color}40`,
                      }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{user.name}</p>
                      {isActive && (
                        <Badge
                          className="mt-1 text-[9px]"
                          style={{ background: `${user.color}20`, color: user.color }}
                        >
                          ACTIVO
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sync (mock) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-accent-violet" />
              <CardTitle>Sincronización</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-text-primary">GitHub privado</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Sincronización por eventos JSON · No configurada
                </p>
              </div>
              <Badge variant="muted">Mock</Badge>
            </div>

            <div className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 mb-4">
              <p className="text-xs text-text-muted">
                Último sync:{" "}
                <span className="text-text-secondary">Nunca</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                Eventos pendientes: <span className="text-accent-amber font-mono">0</span>
              </p>
            </div>

            <Button
              variant="violet"
              onClick={handleSync}
              disabled={syncStatus === "syncing"}
              className="w-full"
            >
              {syncStatus === "syncing" ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Sincronizando...
                </>
              ) : syncStatus === "done" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Sincronizado ✓
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" /> Sincronizar ahora
                </>
              )}
            </Button>
            <p className="text-[10px] text-text-muted text-center mt-2">
              ⚠️ Función mock — GitHub sync pendiente de implementar
            </p>
          </CardContent>
        </Card>

        {/* DB info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-accent-emerald" />
              <CardTitle>Base de datos local</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: "Entrenamientos", value: workouts.filter((w) => !w.deletedAt).length },
                { label: "Movimientos financieros", value: finances.filter((f) => !f.deletedAt).length },
                { label: "Retos", value: challenges.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-bg-border last:border-0">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="font-mono text-sm text-accent-emerald font-medium">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-3">
              SQLite local · Modo mock activo · Los datos persisten en localStorage
            </p>
          </CardContent>
        </Card>

        {/* Version */}
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">Personal Progress Game</p>
                <p className="text-xs text-text-muted">v0.1.0 — MVP</p>
              </div>
              <Badge variant="emerald">Tauri 2</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
