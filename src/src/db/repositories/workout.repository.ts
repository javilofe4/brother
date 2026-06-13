// src/db/repositories/workout.repository.ts
// Ready to connect — currently the app uses Zustand mock store.
// Swap the store calls for these methods when connecting SQLite.

import { v4 as uuid } from "uuid";
import { getDb } from "../client";
import type { Workout, CreateWorkoutInput } from "@/domain/workouts/workout.types";
import type { UserId } from "@/domain/users/user.types";

export const workoutRepository = {
  async findByUser(userId: UserId): Promise<Workout[]> {
    const db = await getDb();
    const rows = await db.select<Workout[]>(
      "SELECT * FROM workouts WHERE user_id = ? AND deleted_at IS NULL ORDER BY date DESC",
      [userId]
    );
    return rows;
  },

  async create(userId: UserId, input: CreateWorkoutInput): Promise<Workout> {
    const db = await getDb();
    const workout: Workout = {
      id: uuid(),
      userId,
      ...input,
      createdAt: new Date().toISOString(),
    };
    await db.execute(
      `INSERT INTO workouts
       (id, user_id, type, duration_minutes, distance_km, weight_kg, reps, intensity, notes, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workout.id,
        workout.userId,
        workout.type,
        workout.durationMinutes,
        workout.distanceKm ?? null,
        workout.weightKg ?? null,
        workout.reps ?? null,
        workout.intensity,
        workout.notes ?? null,
        workout.date,
        workout.createdAt,
      ]
    );
    return workout;
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDb();
    await db.execute(
      "UPDATE workouts SET deleted_at = ? WHERE id = ?",
      [new Date().toISOString(), id]
    );
  },
};
