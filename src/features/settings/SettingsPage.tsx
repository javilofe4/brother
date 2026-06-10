import { useState } from "react";
import { RefreshCw, Database, CheckCircle2, User } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS, type UserId } from "@/domain/users/user.types";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, cn } from "@/shared/components/ui";

export function SettingsPage() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const events = useAppStore((s) => s.progressEvents);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done">("idle");

  const handleSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => setSyncStatus("done"), 2000);
    setTimeout(() => setSyncStatus("idle"), 4000);
  };

  return (
    <div className="p-6 animate-fade-in h-full overflow-y-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Configuración</p>
        <h1 className="font-display text-4xl tracking-wide text-text-primary">Ajustes</h1>
      </div>

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
                      isActive ? "" : "border-bg-border bg-bg-elevated hover:border-bg-card"
                    )}
                    style={
                      isActive
                        ? { borderColor: user.color, backgroundColor: `${user.color}10` }
                        : {}
                    }
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl"
                      style={{ background: `${user.color}20`, border: `1px solid ${user.color}40` }}
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

        {/* Sync */}
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
                <p className="text-xs text-text-muted mt-0.5">Sincronización por ProgressEvents · No configurada</p>
              </div>
              <Badge variant="muted">Mock</Badge>
            </div>
            <div className="rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 mb-4">
              <p className="text-xs text-text-muted">Eventos pendientes: <span className="text-accent-amber font-mono">{events.length}</span></p>
              <p className="text-xs text-text-muted mt-1">Último sync: <span className="text-text-secondary">Nunca</span></p>
            </div>
            <Button variant="violet" onClick={handleSync} disabled={syncStatus === "syncing"} className="w-full">
              {syncStatus === "syncing" ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Sincronizando...</>
              ) : syncStatus === "done" ? (
                <><CheckCircle2 className="h-4 w-4" /> Sincronizado ✓</>
              ) : (
                <><RefreshCw className="h-4 w-4" /> Sincronizar ahora</>
              )}
            </Button>
            <p className="text-[10px] text-text-muted text-center mt-2">⚠️ Función mock — GitHub sync pendiente</p>
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
                { label: "ProgressEvents (Javier)", value: events.filter(e => e.userId === "javier").length },
                { label: "ProgressEvents (Rival)", value: events.filter(e => e.userId === "rival").length },
                { label: "Total eventos", value: events.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-bg-border last:border-0">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="font-mono text-sm text-accent-emerald font-medium">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-3">
              Modo mock activo · Datos en localStorage · SQLite listo para conectar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-text-primary">Personal Progress Game</p>
                <p className="text-xs text-text-muted">v0.2.0 — Game Edition</p>
              </div>
              <Badge variant="emerald">Tauri 2</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
