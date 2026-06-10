import type { UserId } from "@/domain/users/user.types";
import type { Session, CreateSessionInput } from "@/domain/sessions/session.types";
import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import type { MetricSnapshot } from "@/domain/metrics/metric.types";
import type { AchievementProgress, AchievementUnlock } from "@/domain/achievements/achievement.types";
import type { XpLedgerEntry } from "@/domain/xp/xpLedger.types";
import { TEMPLATE_BY_ID } from "@/shared/config/sessionTemplatesConfig";
import { createSession } from "@/domain/sessions/session.service";
import { createProgressEventFromSession } from "@/domain/progress/progressEvent.service";
import { updateMetricSnapshotsForEvent } from "@/domain/metrics/metricSnapshot.service";
import { updateAchievementProgressForEvent } from "@/domain/achievements/achievementProgress.service";
import {
  createActivityXpEntry,
  createAchievementXpEntries,
} from "@/domain/xp/xpLedger.service";

export interface GameStateSlice {
  sessions: Session[];
  progressEvents: ProgressEvent[];
  metricSnapshots: MetricSnapshot[];
  achievementProgress: AchievementProgress[];
  xpLedger: XpLedgerEntry[];
}

export interface GamePipelineResult {
  session: Session;
  event: ProgressEvent;
  metricSnapshots: MetricSnapshot[];
  achievementProgress: AchievementProgress[];
  xpLedger: XpLedgerEntry[];
  newLedgerEntries: XpLedgerEntry[];
  unlocks: AchievementUnlock[];
  summary: {
    activityXp: number;
    achievementXp: number;
    totalXpAdded: number;
  };
}

export function registerSessionThroughPipeline(
  state: GameStateSlice,
  input: CreateSessionInput,
  now = new Date()
): GamePipelineResult {
  const template = TEMPLATE_BY_ID[input.templateId];
  if (!template) throw new Error(`Unknown template: ${input.templateId}`);

  const session = createSession(input, template, now);
  const event = createProgressEventFromSession(session, template, now);
  const progressEvents = [event, ...state.progressEvents];
  const metricSnapshots = updateMetricSnapshotsForEvent(
    state.metricSnapshots,
    progressEvents,
    event,
    now
  );
  const achievementResult = updateAchievementProgressForEvent(
    state.achievementProgress,
    metricSnapshots,
    event.userId,
    event.id,
    now
  );

  const activityEntry = createActivityXpEntry(event);
  const achievementEntries = createAchievementXpEntries(
    event.userId,
    event.id,
    achievementResult.unlocks,
    event.occurredAt
  );
  const newLedgerEntries = [activityEntry, ...achievementEntries];
  const xpLedger = [...newLedgerEntries, ...state.xpLedger];
  const achievementXp = achievementEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return {
    session,
    event,
    metricSnapshots,
    achievementProgress: achievementResult.achievementProgress,
    xpLedger,
    newLedgerEntries,
    unlocks: achievementResult.unlocks,
    summary: {
      activityXp: activityEntry.amount,
      achievementXp,
      totalXpAdded: activityEntry.amount + achievementXp,
    },
  };
}

export function getUserMetricSnapshot(
  snapshots: MetricSnapshot[],
  userId: UserId,
  metricId: string
): MetricSnapshot | undefined {
  return snapshots.find((snapshot) => snapshot.userId === userId && snapshot.metricId === metricId);
}
