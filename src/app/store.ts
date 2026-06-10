import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserId } from "@/domain/users/user.types";
import { normalizeUserId } from "@/domain/users/user.types";
import type { Session, CreateSessionInput } from "@/domain/sessions/session.types";
import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import type { MetricSnapshot } from "@/domain/metrics/metric.types";
import type { AchievementProgress } from "@/domain/achievements/achievement.types";
import type { XpLedgerEntry } from "@/domain/xp/xpLedger.types";
import type { GamePipelineResult } from "@/domain/game/gamePipeline.service";
import { registerSessionThroughPipeline } from "@/domain/game/gamePipeline.service";
import { rebuildMetricSnapshotsForUsers } from "@/domain/metrics/metricSnapshot.service";
import { rebuildAchievementProgressForUsers } from "@/domain/achievements/achievementProgress.service";
import { computeCurrentStreakDays, getMetricValue } from "@/domain/metrics/metricEngine";
import { buildActivityLedgerFromEvents, getUserTotalXp as sumUserXp } from "@/domain/xp/xpLedger.service";
import { ACHIEVEMENT_BY_ID } from "@/domain/achievements/achievementCatalog";
import { TEMPLATE_BY_ID } from "@/shared/config/sessionTemplatesConfig";
import { DEFAULT_ACTIVE_USER_ID } from "@/shared/config/usersConfig";
import { normalizeTags } from "@/domain/tags/tagCatalog";
import { mockProgressEvents } from "@/shared/mock/mockProgressEvents";

const USER_IDS: UserId[] = ["javier", "rival"];

interface AppState {
  activeUserId: UserId;
  setActiveUserId: (id: UserId) => void;

  sessions: Session[];
  progressEvents: ProgressEvent[];
  metricSnapshots: MetricSnapshot[];
  achievementProgress: AchievementProgress[];
  xpLedger: XpLedgerEntry[];
  lastPipelineResult?: GamePipelineResult;

  registerSession: (input: Omit<CreateSessionInput, "userId"> & { userId?: UserId }) => GamePipelineResult;
  getUserTotalXp: (userId: UserId) => number;
  getUserAchievementProgress: (userId: UserId) => AchievementProgress[];
  getUserEvents: (userId: UserId) => ProgressEvent[];
  getUserMetricValue: (userId: UserId, metricId: string) => number;
  getStreak: (userId: UserId) => number;
}

function buildAchievementLedger(progress: AchievementProgress[]): XpLedgerEntry[] {
  return progress.flatMap((item) => {
    const series = ACHIEVEMENT_BY_ID[item.seriesId];
    if (!series) return [];
    return item.unlockedLevels.flatMap((unlock) => {
      const level = series.levels.find((candidate) => candidate.level === unlock.level);
      if (!level) return [];
      return [{
        id: `achievement:${item.userId}:${series.id}:${level.level}`,
        userId: item.userId,
        amount: level.xpReward,
        source: "achievement_unlock" as const,
        referenceId: `${series.id}:${level.level}:${unlock.eventId}`,
        occurredAt: unlock.unlockedAt,
        description: `${series.name} ${level.label}`,
      }];
    });
  });
}

function buildDerivedState(progressEvents: ProgressEvent[]) {
  const metricSnapshots = rebuildMetricSnapshotsForUsers(progressEvents, USER_IDS);
  const achievementProgress = rebuildAchievementProgressForUsers(metricSnapshots, USER_IDS);
  const xpLedger = [
    ...buildAchievementLedger(achievementProgress),
    ...buildActivityLedgerFromEvents(progressEvents),
  ].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return { metricSnapshots, achievementProgress, xpLedger };
}

function normalizeEvent(raw: unknown): ProgressEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const legacyTypeMap: Record<string, ProgressEvent["type"]> = {
    route_completed: "route_session",
    finance_goal_completed: "finance_saving",
    challenge_completed: "challenge_result",
    challenge_failed: "challenge_result",
    cycling_session: "route_session",
    hiit_session: "strength_session",
    yoga_session: "manual_action",
  };
  const rawType = String(value.type ?? "manual_action");
  const type = rawType in TEMPLATE_BY_ID
    ? rawType as ProgressEvent["type"]
    : legacyTypeMap[rawType] ?? "manual_action";
  const template = TEMPLATE_BY_ID[type];
  const rawMetadata =
    value.metadata && typeof value.metadata === "object"
      ? value.metadata as Record<string, unknown>
      : {};
  const metadata = {
    ...rawMetadata,
    amountEur: rawMetadata.amountEur ?? rawMetadata.amount,
    benchPressKg: rawMetadata.benchPressKg ?? rawMetadata.maxWeightKg,
    result: rawType === "challenge_failed" ? "loss" : rawMetadata.result,
  };
  const tags = normalizeTags(Array.isArray(value.tags) ? value.tags.map(String) : []);
  const canonicalTags = Array.from(new Set([...template.defaultTags, ...tags]));
  return {
    id: String(value.id ?? crypto.randomUUID()),
    userId: normalizeUserId(value.userId),
    sessionId: String(value.sessionId ?? `session-${String(value.id ?? crypto.randomUUID())}`),
    type,
    occurredAt: String(value.occurredAt ?? new Date().toISOString()),
    tags: canonicalTags,
    xpFromActivity: Number(value.xpFromActivity ?? value.xpAwarded ?? template.baseXp),
    metadata,
    createdAt: String(value.createdAt ?? value.occurredAt ?? new Date().toISOString()),
  };
}

function normalizeSession(raw: unknown): Session | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const templateId = String(value.templateId ?? "");
  if (!(templateId in TEMPLATE_BY_ID)) return null;
  return {
    id: String(value.id ?? crypto.randomUUID()),
    userId: normalizeUserId(value.userId),
    templateId: templateId as Session["templateId"],
    occurredAt: String(value.occurredAt ?? new Date().toISOString()),
    durationMinutes: typeof value.durationMinutes === "number" ? value.durationMinutes : undefined,
    intensity: typeof value.intensity === "number" ? value.intensity : undefined,
    distanceKm: typeof value.distanceKm === "number" ? value.distanceKm : undefined,
    amountEur: typeof value.amountEur === "number" ? value.amountEur : undefined,
    notes: typeof value.notes === "string" ? value.notes : undefined,
    tags: normalizeTags(Array.isArray(value.tags) ? value.tags.map(String) : []),
    fields: value.fields && typeof value.fields === "object" ? value.fields as Record<string, unknown> : {},
    createdAt: String(value.createdAt ?? new Date().toISOString()),
  };
}

const initialDerived = buildDerivedState(mockProgressEvents);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeUserId: DEFAULT_ACTIVE_USER_ID,
      setActiveUserId: (id) => set({ activeUserId: id }),

      sessions: [],
      progressEvents: mockProgressEvents,
      metricSnapshots: initialDerived.metricSnapshots,
      achievementProgress: initialDerived.achievementProgress,
      xpLedger: initialDerived.xpLedger,

      registerSession: (input) => {
        const state = get();
        const result = registerSessionThroughPipeline(
          state,
          {
            ...input,
            userId: input.userId ?? state.activeUserId,
          }
        );
        set({
          sessions: [result.session, ...state.sessions],
          progressEvents: [result.event, ...state.progressEvents],
          metricSnapshots: result.metricSnapshots,
          achievementProgress: result.achievementProgress,
          xpLedger: result.xpLedger,
          lastPipelineResult: result,
        });
        return result;
      },

      getUserTotalXp: (userId) => sumUserXp(get().xpLedger, userId),

      getUserAchievementProgress: (userId) => {
        return get().achievementProgress.filter((progress) => progress.userId === userId);
      },

      getUserEvents: (userId) => {
        return get()
          .progressEvents
          .filter((event) => event.userId === userId)
          .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
      },

      getUserMetricValue: (userId, metricId) => getMetricValue(get().metricSnapshots, userId, metricId),

      getStreak: (userId) => {
        const events = get().progressEvents.filter((event) => event.userId === userId);
        return computeCurrentStreakDays(events);
      },
    }),
    {
      name: "ppg-v3-storage",
      partialize: (state) => ({
        activeUserId: state.activeUserId,
        sessions: state.sessions,
        progressEvents: state.progressEvents,
        xpLedger: state.xpLedger,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const normalizedEvents = (state.progressEvents ?? [])
          .map(normalizeEvent)
          .filter((event): event is ProgressEvent => Boolean(event));
        const events = normalizedEvents.length > 0 ? normalizedEvents : mockProgressEvents;
        const derived = buildDerivedState(events);
        state.activeUserId = normalizeUserId(state.activeUserId);
        state.sessions = (state.sessions ?? [])
          .map(normalizeSession)
          .filter((session): session is Session => Boolean(session));
        state.progressEvents = events;
        state.metricSnapshots = derived.metricSnapshots;
        state.achievementProgress = derived.achievementProgress;
        state.xpLedger = derived.xpLedger;
      },
    }
  )
);
