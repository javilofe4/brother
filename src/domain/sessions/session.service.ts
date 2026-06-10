import { v4 as uuid } from "uuid";
import type {
  CreateSessionInput,
  Session,
  SessionTemplate,
} from "./session.types";
import { TAG_BY_ID } from "@/domain/tags/tagCatalog";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function toStringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export function createSession(
  input: CreateSessionInput,
  template: SessionTemplate,
  now = new Date(),
  createId = uuid
): Session {
  if (input.templateId !== template.id) {
    throw new Error(`Session template mismatch: ${input.templateId} != ${template.id}`);
  }

  const fields = input.fields ?? {};
  const durationMinutes = input.durationMinutes ?? toNumber(fields.durationMinutes);
  const intensity = input.intensity ?? toNumber(fields.intensity);
  const distanceKm = input.distanceKm ?? toNumber(fields.distanceKm);
  const amountEur =
    input.amountEur ?? toNumber(fields.amountEur) ?? toNumber(fields.amount);
  const notes = input.notes ?? toStringValue(fields.notes);

  const requestedTags = input.tags ?? [];
  const allowedTags = new Set([...template.defaultTags, ...template.allowedTags]);
  const tags = Array.from(
    new Set([
      ...template.defaultTags,
      ...requestedTags.filter((tag) => allowedTags.has(tag)),
      ...(intensity !== undefined && intensity >= 8 && allowedTags.has("intense")
        ? ["intense" as const]
        : []),
      ...(fields.result === "win" && allowedTags.has("rival") ? ["rival" as const] : []),
    ])
  ).filter((tag) => tag in TAG_BY_ID);

  return {
    id: createId(),
    userId: input.userId,
    templateId: input.templateId,
    occurredAt: input.occurredAt ?? now.toISOString(),
    durationMinutes,
    intensity,
    distanceKm,
    amountEur,
    notes,
    tags,
    fields,
    createdAt: now.toISOString(),
  };
}

export function validateTemplateFields(
  template: SessionTemplate,
  fields: Record<string, unknown>
): string[] {
  return template.fields
    .filter((field) => field.required)
    .filter((field) => fields[field.key] === undefined || fields[field.key] === "")
    .map((field) => field.label);
}
