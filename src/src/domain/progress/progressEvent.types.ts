import type { UserId } from "@/domain/users/user.types";
import type { SessionTemplateId } from "@/domain/sessions/session.types";
import type { TagId } from "@/domain/tags/tag.types";

export type ProgressEventType = SessionTemplateId;

export interface ProgressEvent {
  id: string;
  userId: UserId;
  sessionId: string;
  type: ProgressEventType;
  occurredAt: string;
  tags: TagId[];
  xpFromActivity: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type AchievementCategory =
  | "all"
  | "combat"
  | "strength"
  | "endurance"
  | "finance"
  | "challenges"
  | "constancy"
  | "conditions";

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  all: "Todos",
  combat: "Combate",
  strength: "Fuerza",
  endurance: "Resistencia",
  finance: "Finanzas",
  challenges: "Retos",
  constancy: "Constancia",
  conditions: "Condiciones",
};

export const PROGRESS_EVENT_LABELS: Record<ProgressEventType, string> = {
  combat_session: "Sesion de combate",
  strength_session: "Fuerza",
  swimming_session: "Natacion",
  running_session: "Carrera",
  walking_session: "Caminata",
  route_session: "Ruta",
  finance_saving: "Ahorro",
  finance_expense: "Gasto",
  finance_income: "Ingreso",
  challenge_result: "Resultado de reto",
  manual_action: "Accion manual",
};

export const PROGRESS_EVENT_ICONS: Record<ProgressEventType, string> = {
  combat_session: "🥊",
  strength_session: "🏋️",
  swimming_session: "🏊",
  running_session: "🏃",
  walking_session: "🚶",
  route_session: "🗺️",
  finance_saving: "💰",
  finance_expense: "💸",
  finance_income: "💵",
  challenge_result: "🏆",
  manual_action: "✍️",
};

export const EVENT_TO_CATEGORY: Record<
  ProgressEventType,
  Exclude<AchievementCategory, "all">
> = {
  combat_session: "combat",
  strength_session: "strength",
  swimming_session: "endurance",
  running_session: "endurance",
  walking_session: "endurance",
  route_session: "endurance",
  finance_saving: "finance",
  finance_expense: "finance",
  finance_income: "finance",
  challenge_result: "challenges",
  manual_action: "constancy",
};
