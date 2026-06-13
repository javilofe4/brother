import type { LucideIcon } from "lucide-react";
import { Home, PlusCircle, Trophy, Swords } from "lucide-react";

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
}

// Primary nav: 4 items max
export const NAV_ITEMS: NavItem[] = [
  { to: "/",            icon: Home,       label: "Inicio",     exact: true },
  { to: "/register",   icon: PlusCircle, label: "Registrar" },
  { to: "/achievements",icon: Trophy,    label: "Logros" },
  { to: "/challenges",  icon: Swords,    label: "Retos" },
];

// Secondary (header avatar menu)
export const PROFILE_ROUTE  = "/profile";
export const SETTINGS_ROUTE = "/settings";
