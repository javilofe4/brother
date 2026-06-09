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
import type { ScoreEvent, UserScore } from "@/domain/scoring/scoring.types";
import { calculateLevel } from "@/domain/scoring/scoring.types";

// ── Workouts ──────────────────────────────────────────────────────────────────

export const mockWorkouts: Workout[] = [
  {
    id: "w1",
    userId: "javier",
    type: "running",
    durationMinutes: 45,
    distanceKm: 6.5,
    intensity: 8,
    notes: "Buen ritmo, sin parar",
    date: "2025-01-08",
    createdAt: "2025-01-08T07:30:00Z",
  },
  {
    id: "w2",
    userId: "javier",
    type: "weights",
    durationMinutes: 60,
    weightKg: 80,
    reps: 120,
    intensity: 9,
    notes: "Press banca nuevo récord",
    date: "2025-01-07",
    createdAt: "2025-01-07T18:00:00Z",
  },
  {
    id: "w3",
    userId: "rival",
    type: "cycling",
    durationMinutes: 90,
    distanceKm: 35,
    intensity: 7,
    notes: "Ruta montaña",
    date: "2025-01-08",
    createdAt: "2025-01-08T09:00:00Z",
  },
  {
    id: "w4",
    userId: "rival",
    type: "hiit",
    durationMinutes: 30,
    intensity: 10,
    notes: "Brutal",
    date: "2025-01-06",
    createdAt: "2025-01-06T07:00:00Z",
  },
  {
    id: "w5",
    userId: "javier",
    type: "running",
    durationMinutes: 35,
    distanceKm: 5.0,
    intensity: 7,
    date: "2025-01-05",
    createdAt: "2025-01-05T08:00:00Z",
  },
  {
    id: "w6",
    userId: "javier",
    type: "crossfit",
    durationMinutes: 50,
    intensity: 9,
    date: "2025-01-04",
    createdAt: "2025-01-04T07:30:00Z",
  },
  {
    id: "w7",
    userId: "rival",
    type: "weights",
    durationMinutes: 65,
    intensity: 8,
    date: "2025-01-04",
    createdAt: "2025-01-04T19:00:00Z",
  },
];

// ── Finances ──────────────────────────────────────────────────────────────────

export const mockFinances: FinanceEntry[] = [
  {
    id: "f1",
    userId: "javier",
    type: "income",
    amount: 2800,
    category: "salary",
    date: "2025-01-01",
    notes: "Nómina enero",
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "f2",
    userId: "javier",
    type: "expense",
    amount: 350,
    category: "housing",
    date: "2025-01-02",
    notes: "Alquiler",
    createdAt: "2025-01-02T10:00:00Z",
  },
  {
    id: "f3",
    userId: "javier",
    type: "saving",
    amount: 500,
    category: "emergency",
    date: "2025-01-03",
    notes: "Fondo emergencias",
    createdAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "f4",
    userId: "javier",
    type: "expense",
    amount: 180,
    category: "food",
    date: "2025-01-04",
    createdAt: "2025-01-04T10:00:00Z",
  },
  {
    id: "f5",
    userId: "javier",
    type: "expense",
    amount: 120,
    category: "transport",
    date: "2025-01-05",
    notes: "Gasolina y metro",
    createdAt: "2025-01-05T10:00:00Z",
  },
  {
    id: "f6",
    userId: "rival",
    type: "income",
    amount: 3200,
    category: "salary",
    date: "2025-01-01",
    notes: "Nómina enero",
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "f7",
    userId: "rival",
    type: "saving",
    amount: 750,
    category: "investment",
    date: "2025-01-03",
    createdAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "f8",
    userId: "rival",
    type: "expense",
    amount: 420,
    category: "housing",
    date: "2025-01-02",
    createdAt: "2025-01-02T10:00:00Z",
  },
  {
    id: "f9",
    userId: "rival",
    type: "expense",
    amount: 160,
    category: "food",
    date: "2025-01-04",
    createdAt: "2025-01-04T10:00:00Z",
  },
];

export const mockFinancialGoals: FinancialGoal[] = [
  {
    id: "goal1",
    userId: "javier",
    title: "Viaje a la montaña",
    description: "Ahorrar 1200€ para el viaje de verano.",
    targetAmount: 1200,
    currentAmount: 680,
    currency: "EUR",
    status: "active",
    startedAt: "2025-01-01",
    deadlineAt: "2025-06-01",
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "goal2",
    userId: "rival",
    title: "Renovar bici",
    description: "Acumular 600€ para una bicicleta de ruta.",
    targetAmount: 600,
    currentAmount: 420,
    currency: "EUR",
    status: "active",
    startedAt: "2025-01-01",
    deadlineAt: "2025-04-01",
    createdAt: "2025-01-01T09:00:00Z",
  },
];

export const mockEmergencyFunds: EmergencyFund[] = [
  {
    id: "ef1",
    userId: "javier",
    currentAmount: 500,
    targetAmount: 1500,
    savedAt: "2025-01-03",
    note: "Fondo básico 3 meses.",
    createdAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "ef2",
    userId: "rival",
    currentAmount: 750,
    targetAmount: 1800,
    savedAt: "2025-01-03",
    note: "Ahorro para imprevistos.",
    createdAt: "2025-01-03T10:00:00Z",
  },
];

export const mockSavingAllocations: SavingAllocation[] = [
  {
    id: "sa1",
    userId: "javier",
    category: "emergency",
    amount: 500,
    createdAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "sa2",
    userId: "javier",
    category: "education",
    amount: 150,
    createdAt: "2025-01-04T12:00:00Z",
  },
  {
    id: "sa3",
    userId: "javier",
    category: "investment",
    amount: 200,
    createdAt: "2025-01-05T12:00:00Z",
  },
  {
    id: "sa4",
    userId: "rival",
    category: "investment",
    amount: 750,
    createdAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "sa5",
    userId: "rival",
    category: "leisure",
    amount: 120,
    createdAt: "2025-01-04T12:00:00Z",
  },
];

export const mockInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: "inv1",
    userId: "javier",
    name: "Fondo indexado",
    type: "stocks",
    amount: 200,
    expectedReturn: 6,
    timeframeMonths: 36,
    notes: "Aportación mensual para diversificar.",
    createdAt: "2025-01-05T11:00:00Z",
  },
  {
    id: "inv2",
    userId: "javier",
    name: "Curso de trading",
    type: "other",
    amount: 150,
    notes: "Formación financiera estratégica.",
    createdAt: "2025-01-04T14:00:00Z",
  },
  {
    id: "inv3",
    userId: "rival",
    name: "Proyecto local",
    type: "business",
    amount: 300,
    expectedReturn: 12,
    timeframeMonths: 24,
    notes: "Participación en sociedad de negocio.",
    createdAt: "2025-01-06T09:00:00Z",
  },
];

export const mockInvestorProfiles: InvestorProfile[] = [
  {
    id: "ip1",
    userId: "javier",
    riskTolerance: "medium",
    preferredAssets: ["stocks", "business"],
    createdAt: "2025-01-05T11:00:00Z",
  },
  {
    id: "ip2",
    userId: "rival",
    riskTolerance: "high",
    preferredAssets: ["crypto", "stocks"],
    createdAt: "2025-01-06T09:00:00Z",
  },
];

export const mockProjectFinances: ProjectFinance[] = [
  {
    id: "pf1",
    userId: "javier",
    name: "Renovación personal",
    budget: 800,
    spent: 320,
    status: "active",
    notes: "Ahorro para reemplazar equipamiento deportivo.",
    createdAt: "2025-01-05T11:00:00Z",
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: "ach1",
    title: "Primer entrenamiento",
    description: "Registra tu primer entrenamiento y comienza el progreso personal.",
    category: "training",
    rarity: "common",
    xpReward: 20,
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "ach2",
    title: "Fondo emergencias iniciado",
    description: "Empieza a guardar para tu primer fondo de emergencia.",
    category: "finance",
    rarity: "rare",
    xpReward: 30,
    createdAt: "2025-01-02T09:00:00Z",
  },
  {
    id: "ach3",
    title: "Racha de 7 días",
    description: "Completa entrenamientos durante una semana seguida.",
    category: "consistency",
    rarity: "rare",
    xpReward: 40,
    createdAt: "2025-01-03T09:00:00Z",
  },
  {
    id: "ach4",
    title: "Oportunidad registrada",
    description: "Anota tu primera oportunidad de inversión manual.",
    category: "special",
    rarity: "rare",
    xpReward: 25,
    createdAt: "2025-01-04T09:00:00Z",
  },
];

export const mockUserAchievements: UserAchievement[] = [
  {
    id: "ua1",
    achievementId: "ach1",
    userId: "javier",
    status: "unlocked",
    progressCurrent: 100,
    progressTarget: 100,
    progress: 100,
    unlockedAt: "2025-01-04T09:00:00Z",
    createdAt: "2025-01-04T09:00:00Z",
  },
  {
    id: "ua2",
    achievementId: "ach2",
    userId: "javier",
    status: "unlocked",
    progressCurrent: 100,
    progressTarget: 100,
    progress: 100,
    unlockedAt: "2025-01-07T10:00:00Z",
    createdAt: "2025-01-07T10:00:00Z",
  },
  {
    id: "ua3",
    achievementId: "ach3",
    userId: "javier",
    status: "locked",
    progressCurrent: 45,
    progressTarget: 100,
    progress: 45,
    unlockedAt: null,
    createdAt: "2025-01-08T09:00:00Z",
  },
];

export const mockProgressEvents: ProgressEvent[] = [
  {
    id: "pe1",
    userId: "javier",
    type: "workout_logged",
    title: "Entrenamiento matutino",
    description: "30 min de carrera suave",
    occurredAt: "2025-01-08T07:00:00Z",
    xp: 25,
    createdAt: "2025-01-08T07:00:00Z",
  },
  {
    id: "pe2",
    userId: "javier",
    type: "manual_action",
    title: "Lectura de libro motivacional",
    description: "Agregar hábito de crecimiento personal.",
    occurredAt: "2025-01-07T19:00:00Z",
    xp: 15,
    createdAt: "2025-01-07T19:00:00Z",
  },
  {
    id: "pe3",
    userId: "rival",
    type: "challenge_completed",
    title: "Reto completado",
    description: "Victoria en el reto semanal.",
    occurredAt: "2025-01-08T17:00:00Z",
    xp: 35,
    createdAt: "2025-01-08T17:00:00Z",
  },
];

export const mockDuelStats: DuelStat[] = [
  {
    userId: "javier",
    weeklyXp: 150,
    monthlyXp: 420,
    achievementsUnlocked: 8,
    challengesWon: 3,
    streak: 5,
    workouts: 24,
    savingsThisMonth: 500,
  },
  {
    userId: "rival",
    weeklyXp: 130,
    monthlyXp: 390,
    achievementsUnlocked: 6,
    challengesWon: 2,
    streak: 4,
    workouts: 19,
    savingsThisMonth: 750,
  },
];

// ── Challenges ────────────────────────────────────────────────────────────────

export const mockChallenges: Challenge[] = [
  {
    id: "c1",
    createdBy: "javier",
    targetUser: "rival",
    title: "10 entrenamientos en enero",
    type: "workout_count",
    targetValue: 10,
    unit: "entrenamientos",
    points: 50,
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "accepted",
    currentValue: 3,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "c2",
    createdBy: "rival",
    targetUser: "javier",
    title: "Correr 50km este mes",
    type: "distance",
    targetValue: 50,
    unit: "km",
    points: 75,
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "accepted",
    currentValue: 11.5,
    createdAt: "2025-01-01T12:00:00Z",
  },
  {
    id: "c3",
    createdBy: "javier",
    targetUser: "rival",
    title: "Ahorrar 1000€ en enero",
    type: "saving_amount",
    targetValue: 1000,
    unit: "€",
    points: 100,
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    status: "accepted",
    currentValue: 750,
    createdAt: "2025-01-02T09:00:00Z",
  },
  {
    id: "c4",
    createdBy: "rival",
    targetUser: "javier",
    title: "Racha de 7 días entreno",
    type: "streak",
    targetValue: 7,
    unit: "días",
    points: 40,
    startDate: "2025-01-01",
    endDate: "2025-01-15",
    status: "proposed",
    currentValue: 0,
    createdAt: "2025-01-05T15:00:00Z",
  },
];

// ── Scores ────────────────────────────────────────────────────────────────────

const javierPoints = 340;
const rivalPoints = 285;

export const mockUserScores: UserScore[] = [
  {
    userId: "javier",
    totalPoints: javierPoints,
    ...calculateLevel(javierPoints),
    workoutsCompleted: 24,
    challengesWon: 3,
    monthlySavings: 500,
  },
  {
    userId: "rival",
    totalPoints: rivalPoints,
    ...calculateLevel(rivalPoints),
    workoutsCompleted: 19,
    challengesWon: 2,
    monthlySavings: 750,
  },
];

// ── Weekly progress chart data ─────────────────────────────────────────────────

export const mockWeeklyData = [
  { day: "Lun", javier: 15, rival: 10 },
  { day: "Mar", javier: 10, rival: 25 },
  { day: "Mié", javier: 20, rival: 10 },
  { day: "Jue", javier: 0, rival: 15 },
  { day: "Vie", javier: 15, rival: 20 },
  { day: "Sáb", javier: 25, rival: 10 },
  { day: "Dom", javier: 10, rival: 0 },
];

