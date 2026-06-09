import { NavLink } from "react-router-dom";
import { Settings, Zap } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USER_LIST } from "@/shared/config/usersConfig";
import { NAV_ITEMS, SETTINGS_ROUTE } from "@/shared/config/navigationConfig";
import { APP_SHORT_NAME } from "@/shared/config/appConfig";
import { cn } from "@/shared/components/ui";


export function Sidebar() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const scores = useAppStore((s) => s.scores);
  const activeUser = USER_LIST[activeUserId];
  const score = scores.find((s) => s.userId === activeUserId);

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-bg-border bg-bg-elevated flex-shrink-0">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-5 border-b border-bg-border"
        data-tauri-drag-region
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-display text-lg leading-none text-text-primary tracking-wide">
            PPG
          </p>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">
            Progress Game
          </p>
        </div>
      </div>

      {/* Active User Card */}
      <div className="mx-3 mt-3 rounded-lg border border-bg-border bg-bg-card p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
            style={{ background: `${activeUser.color}20`, border: `1px solid ${activeUser.color}40` }}
          >
            {activeUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">{activeUser.name}</p>
            <p className="text-xs text-text-muted">
              Nv. {score?.level ?? 1} ·{" "}
              <span style={{ color: activeUser.color }}>
                {score?.totalPoints ?? 0} pts
              </span>
            </p>
          </div>
        </div>
        {/* Level progress */}
        <div className="mt-2.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-border">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${score?.progressToNextLevel ?? 0}%`,
                background: activeUser.color,
                boxShadow: `0 0 8px ${activeUser.color}80`,
              }}
            />
          </div>
          <p className="mt-1 text-[10px] text-text-muted">
            {score?.progressToNextLevel ?? 0}/100 al siguiente nivel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                isActive
                  ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
                  : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-accent-cyan" : ""
                  )}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-bg-border p-2">
        <NavLink
          to={SETTINGS_ROUTE}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
              isActive
                ? "bg-accent-cyan/10 text-accent-cyan"
                : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>Ajustes</span>
        </NavLink>
      </div>
    </aside>
  );
}
