import type { Workout } from "@/domain/workouts/workout.types";
import type { FinanceEntry } from "@/domain/finances/finance.types";
import type { Challenge } from "@/domain/challenges/challenge.types";
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
    category: "savings",
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
    userId: "rival",
    type: "income",
    amount: 3200,
    category: "salary",
    date: "2025-01-01",
    notes: "Nómina enero",
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "f6",
    userId: "rival",
    type: "saving",
    amount: 750,
    category: "savings",
    date: "2025-01-03",
    createdAt: "2025-01-03T10:00:00Z",
  },
  {
    id: "f7",
    userId: "rival",
    type: "expense",
    amount: 420,
    category: "housing",
    date: "2025-01-02",
    createdAt: "2025-01-02T10:00:00Z",
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
