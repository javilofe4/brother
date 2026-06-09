import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Star,
  PlusCircle,
  ShieldCheck,
  Settings,
} from "lucide-react";

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/achievements", icon: Star, label: "Logros" },
  { to: "/register", icon: PlusCircle, label: "Registrar" },
  { to: "/duel", icon: ShieldCheck, label: "Duelo" },
];

export const SETTINGS_ROUTE = "/settings";
