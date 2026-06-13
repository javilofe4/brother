import { NavLink, useNavigate } from "react-router-dom";
import { Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/app/store";
import { USERS } from "@/domain/users/user.types";
import { NAV_ITEMS, PROFILE_ROUTE, SETTINGS_ROUTE } from "@/shared/config/navigationConfig";
import { getLevelFromXp } from "@/shared/config/xpConfig";
import { cn, Progress } from "@/shared/components/ui";

function UserSwitcher() {
  const [open, setOpen] = useState(false);
  const activeUserId = useAppStore((s) => s.activeUserId);
  const setActiveUserId = useAppStore((s) => s.setActiveUserId);
  const getUserTotalXp = useAppStore((s) => s.getUserTotalXp);

  const activeUser = USERS[activeUserId];
  const xp = getUserTotalXp(activeUserId);
  const { level, levelConfig, progress, xpToNext } = getLevelFromXp(xp);
  const otherUserId = activeUserId === "javier" ? "rival" : "javier";
  const otherUser = USERS[otherUserId];

  return (
    <div className="relative px-3 pt-3 pb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] px-3 py-2.5 hover:border-[var(--accent)] transition-colors group"
      >
        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 font-semibold"
          style={{ background: `${activeUser.color}18`, color: activeUser.color }}
        >
          {activeUser.avatar}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{activeUser.name}</p>
          <p className="text-xs text-[var(--text-muted)]">
            <span style={{ color: levelConfig.color }}>{levelConfig.icon} {levelConfig.title}</span>
            {" · "}Nv.{level}
          </p>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-[var(--text-muted)] transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {/* XP bar */}
      <div className="px-1 mt-2 mb-1">
        <Progress value={progress} color={activeUser.color} thin />
        <p className="text-[10px] text-[var(--text-muted)] mt-1 text-right">
          {xp.toLocaleString()} XP
          {xpToNext > 0 && ` · ${xpToNext} para Nv.${level + 1}`}
        </p>
      </div>

      {/* Dropdown: switch user */}
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 rounded-xl border border-[var(--bg-border)] bg-[var(--bg-surface)] shadow-card-md z-50 overflow-hidden">
          <button
            onClick={() => { setActiveUserId(otherUserId); setOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 font-semibold"
              style={{ background: `${otherUser.color}18`, color: otherUser.color }}
            >
              {otherUser.avatar}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">Cambiar a {otherUser.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{getLevelFromXp(getUserTotalXp(otherUserId)).levelConfig.title}</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-52 flex-col border-r border-[var(--bg-border)] bg-[var(--bg-surface)] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--bg-border)]" data-tauri-drag-region>
        <div className="h-7 w-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        <div>
          <p className="font-bold text-sm text-[var(--text-primary)] leading-none">Progress Game</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Personal · 2 jugadores</p>
        </div>
      </div>

      {/* User switcher */}
      <UserSwitcher />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-[var(--accent)]")} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Profile + Settings */}
      <div className="border-t border-[var(--bg-border)] px-3 py-2 space-y-0.5">
        <NavLink
          to={SETTINGS_ROUTE}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-[var(--accent-light)] text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]"
            )
          }
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          Ajustes
        </NavLink>
      </div>
    </aside>
  );
}
