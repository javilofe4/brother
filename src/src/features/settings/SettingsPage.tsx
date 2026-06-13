import { useState } from "react";
import { RefreshCw, Database, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import type { UserId } from "@/domain/users/user.types";
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
    <div className="h-full overflow-y-auto">
      <div className="max-w-lg mx-auto px-6 py-6 animate-fade-in space-y-4">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ajustes</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Configuración de la app</p>
        </div>

        {/* User selection */}
        <Card>
          <CardHeader>
            <CardTitle>Usuario activo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Selecciona quién está usando la app ahora mismo
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["javier", "rival"] as UserId[]).map((uid) => {
                const user = USERS[uid];
                const isActive = uid === activeUserId;
                return (
                  <button
                    key={uid}
                    onClick={() => setActiveUserId(uid)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all duration-200",
                      isActive
                        ? ""
                        : "border-[var(--bg-border)] bg-[var(--bg-elevated)] hover:border-[var(--bg-border)]"
                    )}
                    style={isActive ? { borderColor: user.color, backgroundColor: `${user.color}08` } : {}}
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-xl font-semibold flex-shrink-0"
                      style={{ background: `${user.color}18`, color: user.color }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--text-primary)]">{user.name}</p>
                      {isActive && (
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{ background: `${user.color}18`, color: user.color }}
                        >
                          Activo
                        </span>
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
            <div className="flex items-center justify-between">
              <CardTitle>Sincronización</CardTitle>
              <Badge variant="muted">Próximamente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)] mb-1">Sincronización por eventos</p>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Los datos se guardan localmente. La sincronización entre dispositivos se implementará
              exportando eventos como JSON a un repositorio compartido.
            </p>
            <div className="rounded-lg border border-[var(--bg-border)] bg-[var(--bg-elevated)] px-3 py-2 mb-3">
              <p className="text-xs text-[var(--text-muted)]">
                Eventos guardados:{" "}
                <span className="font-mono font-semibold text-[var(--text-primary)]">{events.length}</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Último sync: Nunca</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleSync}
              disabled={syncStatus === "syncing"}
              className="w-full"
            >
              {syncStatus === "syncing" ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Sincronizando...</>
              ) : syncStatus === "done" ? (
                <><CheckCircle2 className="h-4 w-4" /> Sincronizado</>
              ) : (
                <><RefreshCw className="h-4 w-4" /> Sincronizar ahora</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* DB info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Datos locales</CardTitle>
              <Badge variant="muted">localStorage</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: "Sesiones (Javier)", value: events.filter((e) => e.userId === "javier").length },
                { label: "Sesiones (Rival)", value: events.filter((e) => e.userId === "rival").length },
                { label: "Total eventos", value: events.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-[var(--bg-border)] last:border-0">
                  <span className="text-sm text-[var(--text-secondary)]">{label}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              Los datos se almacenan en tu dispositivo. No se envían a ningún servidor.
              No compartas capturas con datos personales.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Personal Progress Game</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">v0.3.0 · Local-first</p>
              </div>
              <Badge variant="default">Tauri 2</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
