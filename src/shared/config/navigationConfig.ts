import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Trophy,
  PlusCircle,
  Swords,
  User,
} from "lucide-react";

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  accent?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/achievements", icon: Trophy, label: "Logros" },
  { to: "/register", icon: PlusCircle, label: "Registrar", accent: "#00e5ff" },
  { to: "/duel", icon: Swords, label: "Duelo" },
  { to: "/profile", icon: User, label: "Perfil" },
];

export const SETTINGS_ROUTE = "/settings";
