import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserId } from "@/domain/users/user.types";
import type { Workout } from "@/domain/workouts/workout.types";
import type {
  FinanceEntry,
  FinancialGoal,
  EmergencyFund,
  InvestmentOpportunity,
  InvestorProfile,
  ProjectFinance,
  SavingAllocation,
} from "@/domain/finances/finance.types";
import type { Challenge } from "@/domain/challenges/challenge.types";
import type { Achievement, UserAchievement } from "@/domain/achievements/achievement.types";
import type { ProgressEvent } from "@/domain/progress/progress.types";
import type { DuelStat } from "@/domain/duel/duel.types";
import {
  mockWorkouts,
  mockFinances,
  mockChallenges,
  mockUserScores,
  mockAchievements,
  mockUserAchievements,
  mockFinancialGoals,
  mockEmergencyFunds,
  mockSavingAllocations,
  mockInvestmentOpportunities,
  mockInvestorProfiles,
  mockProjectFinances,
  mockProgressEvents,
  mockDuelStats,
} from "@/shared/mock/mock.data";
import type { UserScore } from "@/domain/scoring/scoring.types";
import { DEFAULT_ACTIVE_USER_ID } from "@/shared/config/usersConfig";
import { LEVEL_POINTS } from "@/shared/config/scoringConfig";

interface AppState {
  // Active user
  activeUserId: UserId;
  setActiveUserId: (id: UserId) => void;

  // Data
  workouts: Workout[];
  finances: FinanceEntry[];
  challenges: Challenge[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  progressEvents: ProgressEvent[];
  duelStats: DuelStat[];
  financialGoals: FinancialGoal[];
  emergencyFunds: EmergencyFund[];
  savingAllocations: SavingAllocation[];
  investmentOpportunities: InvestmentOpportunity[];
  investorProfiles: InvestorProfile[];
  projectFinances: ProjectFinance[];
  scores: UserScore[];

  // Actions
  addWorkout: (workout: Workout) => void;
  addFinance: (entry: FinanceEntry) => void;
  addChallenge: (challenge: Challenge) => void;
  addAchievement: (achievement: Achievement) => void;
  addUserAchievement: (userAchievement: UserAchievement) => void;
  addProgressEvent: (event: ProgressEvent) => void;
  addDuelStat: (stat: DuelStat) => void;
  addFinancialGoal: (goal: FinancialGoal) => void;
  addEmergencyFund: (fund: EmergencyFund) => void;
  addSavingAllocation: (allocation: SavingAllocation) => void;
  addInvestmentOpportunity: (opportunity: InvestmentOpportunity) => void;
  addInvestorProfile: (profile: InvestorProfile) => void;
  addProjectFinance: (project: ProjectFinance) => void;
  updateChallengeStatus: (
    id: string,
    status: Challenge["status"],
    currentValue?: number
  ) => void;

  // Score
  updateScore: (userId: UserId, points: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeUserId: DEFAULT_ACTIVE_USER_ID,
      setActiveUserId: (id) => set({ activeUserId: id }),

      workouts: mockWorkouts,
      finances: mockFinances,
      challenges: mockChallenges,
      achievements: mockAchievements,
      userAchievements: mockUserAchievements,
      progressEvents: mockProgressEvents,
      duelStats: mockDuelStats,
      financialGoals: mockFinancialGoals,
      emergencyFunds: mockEmergencyFunds,
      savingAllocations: mockSavingAllocations,
      investmentOpportunities: mockInvestmentOpportunities,
      investorProfiles: mockInvestorProfiles,
      projectFinances: mockProjectFinances,
      scores: mockUserScores,

      addWorkout: (workout) =>
        set((state) => ({ workouts: [workout, ...state.workouts] })),

      addFinance: (entry) =>
        set((state) => ({ finances: [entry, ...state.finances] })),

      addChallenge: (challenge) =>
        set((state) => ({ challenges: [challenge, ...state.challenges] })),

      addAchievement: (achievement) =>
        set((state) => ({ achievements: [achievement, ...state.achievements] })),

      addUserAchievement: (userAchievement) =>
        set((state) => ({ userAchievements: [userAchievement, ...state.userAchievements] })),

      addProgressEvent: (event) =>
        set((state) => ({ progressEvents: [event, ...state.progressEvents] })),

      addDuelStat: (stat) =>
        set((state) => ({ duelStats: [stat, ...state.duelStats] })),

      addFinancialGoal: (goal) =>
        set((state) => ({ financialGoals: [goal, ...state.financialGoals] })),

      addEmergencyFund: (fund) =>
        set((state) => ({ emergencyFunds: [fund, ...state.emergencyFunds] })),

      addSavingAllocation: (allocation) =>
        set((state) => ({ savingAllocations: [allocation, ...state.savingAllocations] })),

      addInvestmentOpportunity: (opportunity) =>
        set((state) => ({ investmentOpportunities: [opportunity, ...state.investmentOpportunities] })),

      addInvestorProfile: (profile) =>
        set((state) => ({ investorProfiles: [profile, ...state.investorProfiles] })),

      addProjectFinance: (project) =>
        set((state) => ({ projectFinances: [project, ...state.projectFinances] })),

      updateChallengeStatus: (id, status, currentValue) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  ...(currentValue !== undefined ? { currentValue } : {}),
                }
              : c
          ),
        })),

      updateScore: (userId, points) =>
        set((state) => ({
          scores: state.scores.map((s) =>
            s.userId === userId
              ? (() => {
                  const newTotal = Math.max(0, s.totalPoints + points);
                  const level = Math.floor(newTotal / LEVEL_POINTS) + 1;
                  const progress = newTotal % LEVEL_POINTS;
                  return {
                    ...s,
                    totalPoints: newTotal,
                    level,
                    progressToNextLevel: progress,
                  };
                })()
              : s
          ),
        })),
    }),
    {
      name: "ppg-storage",
      partialize: (state) => ({
        activeUserId: state.activeUserId,
        workouts: state.workouts,
        finances: state.finances,
        challenges: state.challenges,
        achievements: state.achievements,
        userAchievements: state.userAchievements,
        progressEvents: state.progressEvents,
        duelStats: state.duelStats,
        financialGoals: state.financialGoals,
        emergencyFunds: state.emergencyFunds,
        savingAllocations: state.savingAllocations,
        investmentOpportunities: state.investmentOpportunities,
        investorProfiles: state.investorProfiles,
        projectFinances: state.projectFinances,
        scores: state.scores,
      }),
    }
  )
);

// Selectors
export const selectActiveUser = (state: AppState) => state.activeUserId;
export const selectUserScore = (userId: UserId) => (state: AppState) =>
  state.scores.find((s) => s.userId === userId);
export const selectUserWorkouts = (userId: UserId) => (state: AppState) =>
  state.workouts.filter((w) => w.userId === userId && !w.deletedAt);
export const selectUserFinances = (userId: UserId) => (state: AppState) =>
  state.finances.filter((f) => f.userId === userId && !f.deletedAt);
