import { supabase } from './supabase'

function toSnakeCase(record: any): any {
  const MAP: Record<string, string> = {
    completedAt: 'completed_at',
    durationMinutes: 'duration_minutes',
    caloriesBurned: 'calories_burned',
    sleepHours: 'sleep_hours',
    waterLiters: 'water_liters',
    planSteps: 'plan_steps',
    lastCompletedDate: 'last_completed_date',
    howWeMet: 'how_we_met',
    goalType: 'goal_type',
    createdAt: 'created_at',
    currentValue: 'current_value',
    targetValue: 'target_value',
  }

  const result: any = {}
  for (const [key, value] of Object.entries(record)) {
    const snakeKey = MAP[key] ?? key
    result[snakeKey] = value
  }
  return result
}

function toCamelCase(record: any): any {
  const MAP: Record<string, string> = {
    completed_at: 'completedAt',
    duration_minutes: 'durationMinutes',
    calories_burned: 'caloriesBurned',
    sleep_hours: 'sleepHours',
    water_liters: 'waterLiters',
    plan_steps: 'planSteps',
    last_completed_date: 'lastCompletedDate',
    how_we_met: 'howWeMet',
    goal_type: 'goalType',
    created_at: 'createdAt',
    current_value: 'currentValue',
    target_value: 'targetValue',
  }

  const result: any = {}
  for (const [key, value] of Object.entries(record)) {
    const camelKey = MAP[key] ?? key
    result[camelKey] = value
  }
  return result
}

export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.id ?? null
}

export async function syncUpsert(table: string, records: any[]) {
  const user_id = await getUserId()
  if (!user_id || records.length === 0) return
  const rows = records.map((r) => toSnakeCase({ ...r, user_id }))
  const { error } = await supabase.from(table).upsert(rows)
  if (error) throw new Error(error.message);
}

export async function syncDelete(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw new Error(error.message);
}

export async function syncFetch<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*')
  if (error) throw new Error(error.message);
  return ((data ?? []).map(toCamelCase)) as T[]
}