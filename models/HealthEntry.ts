export interface HealthEntry {
  id: string;
  date: string;
  weight?: number; // in kg
  sleepHours?: number; // hours slept
  waterLiters?: number; // water consumed
  steps?: number; // steps walked
  calories?: number; // calories burned
  notes?: string; // optional notes
}
