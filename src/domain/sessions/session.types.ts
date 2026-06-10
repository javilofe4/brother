import type { UserId } from "@/domain/users/user.types";
import type { TagId } from "@/domain/tags/tag.types";

export type SessionTemplateId =
  | "combat_session"
  | "strength_session"
  | "swimming_session"
  | "running_session"
  | "walking_session"
  | "route_session"
  | "finance_saving"
  | "finance_expense"
  | "finance_income"
  | "challenge_result"
  | "manual_action";

export type SessionFieldType = "number" | "text" | "slider" | "select" | "textarea";

export interface SessionFieldDefinition {
  key: string;
  label: string;
  type: SessionFieldType;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface SessionTemplate {
  id: SessionTemplateId;
  title: string;
  description: string;
  defaultTags: TagId[];
  allowedTags: TagId[];
  fields: SessionFieldDefinition[];
  baseXp: number;
}

export interface Session {
  id: string;
  userId: UserId;
  templateId: SessionTemplateId;
  occurredAt: string;
  durationMinutes?: number;
  intensity?: number;
  distanceKm?: number;
  amountEur?: number;
  notes?: string;
  tags: TagId[];
  fields: Record<string, unknown>;
  createdAt: string;
}

export interface CreateSessionInput {
  userId: UserId;
  templateId: SessionTemplateId;
  occurredAt?: string;
  durationMinutes?: number;
  intensity?: number;
  distanceKm?: number;
  amountEur?: number;
  notes?: string;
  tags?: TagId[];
  fields?: Record<string, unknown>;
}
