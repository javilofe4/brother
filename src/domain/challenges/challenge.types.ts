import type { UserId } from "@/domain/users/user.types";

export type ChallengeStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "active"
  | "completed"
  | "failed"
  | "expired"
  | "cancelled";

export type ChallengeType = "direct" | "versus";

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  createdByUserId: UserId;
  assignedToUserId?: UserId;
  status: ChallengeStatus;
  /** MetricDefinition id used to track progress (optional for direct challenges) */
  metricId?: string;
  targetValue?: number;
  startsAt: string;
  endsAt: string;
  rewardXp: number;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface CreateChallengeInput {
  type: ChallengeType;
  title: string;
  description: string;
  createdByUserId: UserId;
  assignedToUserId?: UserId;
  metricId?: string;
  targetValue?: number;
  endsAt: string;
  rewardXp: number;
}

export const CHALLENGE_STATUS_LABELS: Record<ChallengeStatus, string> = {
  draft: "Borrador",
  sent: "Enviado",
  accepted: "Aceptado",
  rejected: "Rechazado",
  active: "Activo",
  completed: "Completado",
  failed: "Fallido",
  expired: "Caducado",
  cancelled: "Cancelado",
};

export const CHALLENGE_STATUS_COLORS: Record<ChallengeStatus, string> = {
  draft: "#8888aa",
  sent: "#f59e0b",
  accepted: "#00e5ff",
  rejected: "#f43f5e",
  active: "#10b981",
  completed: "#f59e0b",
  failed: "#f43f5e",
  expired: "#444466",
  cancelled: "#444466",
};
