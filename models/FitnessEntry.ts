export interface FitnessEntry {
  id: string,
  date: string,
  type: WorkoutType,
  durationMinutes: number,
  caloriesBurned?: number,

  notes?: string,

  exercises?: ExerciseEntry[];
}

export type WorkoutType = "strength" | "cardio" | "flexibility" | "sports" | "other";

export type ExerciseEntry = {
  name: string;

  // for strength exercise
  sets?: number;
  reps?: number;
  weightKg?: number;

  // for cardio exercises
  durationMinutes?: number; // for cardio-style exercises
  distanceKm?: number;

  notes?: string;
};