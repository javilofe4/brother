import { NavLink } from "react-router-dom";
import { Settings, Zap } from "lucide-react";
import { useAppStore } from "@/app/store";
import { USER_LIST } from "@/shared/config/usersConfig";
import { NAV_ITEMS, SETTINGS_ROUTE } from "@/shared/config/navigationConfig";
import { getLevelFromXp } from "@/shared/config/xpConfig";
import { cn } from "@/shared/components/ui";

export function Sidebar() {
  const activeUserId = useAppStore((s) => s.activeUserId);
  const getUserTotalXp = useAppStore((s) => s.getUserTotalXp);
  const activeUser = USER_LIST[activeUserId];
  const totalXp = getUserTotalXp(activeUserId);
  const { level, levelConfig, progress, xpToNext } = getLevelFromXp(totalXp);

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
          <p className="font-display text-lg leading-none text-text-primary tracking-wide">PPG</p>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">Progress Game</p>
        </div>
      </div>

      {/* Active User Card */}
      <div className="mx-3 mt-3 rounded-xl border border-bg-border bg-bg-card p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl flex-shrink-0"
            style={{ background: `${activeUser.color}20`, border: `1px solid ${activeUser.color}40` }}
          >
            {activeUser.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">{activeUser.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{levelConfig.icon}</span>
              <p className="text-xs font-medium" style={{ color: levelConfig.color }}>
                {levelConfig.title}
              </p>
            </div>
          </div>
        </div>
        {/* XP bar */}
        <div className="mt-2.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-border">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: levelConfig.color,
                boxShadow: `0 0 8px ${levelConfig.color}80`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between">
            <p className="text-[10px] text-text-muted">
              <span style={{ color: activeUser.color }} className="font-mono">{totalXp} XP</span>
            </p>
            {xpToNext > 0 && (
              <p className="text-[10px] text-text-muted">{xpToNext} para Nv.{level + 1}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, accent }) => (
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
                  className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-accent-cyan" : "")}
                  style={!isActive && accent ? { color: accent + "88" } : {}}
                />
                <span>{label}</span>
                {to === "/register" && !isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
                )}
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
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
              isActive ? "bg-accent-cyan/10 text-accent-cyan" : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
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
