import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import { TEMPLATE_BY_ID } from "@/shared/config/sessionTemplatesConfig";

function evt(
  id: string,
  userId: "javier" | "rival",
  type: ProgressEvent["type"],
  occurredAt: string,
  metadata: Record<string, unknown>,
  tags: ProgressEvent["tags"]
): ProgressEvent {
  return {
    id,
    userId,
    sessionId: `session-${id}`,
    type,
    occurredAt,
    tags,
    xpFromActivity: TEMPLATE_BY_ID[type].baseXp,
    metadata: { templateId: type, ...metadata },
    createdAt: occurredAt,
  };
}

export const mockProgressEvents: ProgressEvent[] = [
  evt("pe1", "javier", "combat_session", "2026-06-08T07:30:00Z",
    { durationMinutes: 60, intensity: 9, combatStyle: "Kickboxing" },
    ["combat", "morning", "intense"]),
  evt("pe2", "javier", "strength_session", "2026-06-07T18:00:00Z",
    { durationMinutes: 65, intensity: 9, benchPressKg: 100, deadliftKg: 160, squatKg: 140 },
    ["strength", "intense", "personal_record"]),
  evt("pe3", "javier", "running_session", "2026-06-06T07:30:00Z",
    { durationMinutes: 35, distanceKm: 5, intensity: 7 },
    ["running", "morning", "outdoor"]),
  evt("pe4", "javier", "combat_session", "2026-06-05T08:00:00Z",
    { durationMinutes: 45, intensity: 8 },
    ["combat", "outdoor", "summer", "extreme_heat", "intense"]),
  evt("pe5", "javier", "finance_saving", "2026-06-03T10:00:00Z",
    { amountEur: 500 },
    ["finance"]),
  evt("pe6", "javier", "challenge_result", "2026-06-01T20:00:00Z",
    { result: "win" },
    ["challenge", "rival"]),
  evt("pe7", "javier", "route_session", "2026-05-28T08:00:00Z",
    { durationMinutes: 180, distanceKm: 42, intensity: 7 },
    ["route", "outdoor"]),
  evt("pe8", "javier", "swimming_session", "2026-05-26T09:00:00Z",
    { durationMinutes: 50, distanceKm: 1.5, intensity: 6 },
    ["swimming"]),

  evt("pr1", "rival", "route_session", "2026-06-08T09:00:00Z",
    { durationMinutes: 120, distanceKm: 35, intensity: 8 },
    ["route", "outdoor", "intense"]),
  evt("pr2", "rival", "strength_session", "2026-06-07T18:00:00Z",
    { durationMinutes: 65, intensity: 8, benchPressKg: 85, deadliftKg: 130, squatKg: 110 },
    ["strength", "intense"]),
  evt("pr3", "rival", "swimming_session", "2026-06-05T07:30:00Z",
    { durationMinutes: 50, intensity: 7 },
    ["swimming", "morning"]),
  evt("pr4", "rival", "finance_saving", "2026-06-03T10:00:00Z",
    { amountEur: 750 },
    ["finance"]),
  evt("pr5", "rival", "combat_session", "2026-05-30T08:00:00Z",
    { durationMinutes: 60, intensity: 8 },
    ["combat", "intense"]),
  evt("pr6", "rival", "walking_session", "2026-05-29T19:00:00Z",
    { durationMinutes: 60, distanceKm: 4 },
    ["walking", "outdoor"]),
];
