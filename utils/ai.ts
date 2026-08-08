import { ENV } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InsightScreen =
  | "goals"
  | "habits"
  | "health"
  | "fitness"
  | "finance"
  | "relationships"
  | "today";

  type GoalPlanResponse = {
  steps: string[];
};

// ─── Cache helpers ─────────────────────────────────────────────────────────────

const todayKey = (screen: InsightScreen) => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `ai_insight_${screen}_${yyyy}-${mm}-${dd}`;
};

export async function getCachedInsight(
  screen: InsightScreen
): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(todayKey(screen));
  } catch {
    return null;
  }
}

export async function setCachedInsight(
  screen: InsightScreen,
  insight: string
): Promise<void> {
  try {
    await AsyncStorage.setItem(todayKey(screen), insight);
  } catch {
    // silently fail — cache is best-effort
  }
}

// ─── Supabase edge function client ────────────────────────────────────────────

const SUPABASE_URL = ENV.supabaseUrl;      // already public — safe
const SUPABASE_ANON_KEY = ENV.supabaseAnonKey;

async function callEdgeFunction(
  screen: InsightScreen,
  context: string,
  userJwt: string
): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-insight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userJwt}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ screen, context }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ai-insight function error ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.insight ?? "";
}

// ─── Per-screen context builders ───────────────────────────────────────────────

// Each builder accepts the raw Zustand store state and returns a human-readable
// context string that gets sent to OpenAI.

export function buildGoalsContext(goalsStore: {
  goals: { title: string; currentValue: number; targetValue: number; unit: string; deadline: string; goalType: "min" | "max" | "binary" }[];
}): string {
  const { goals } = goalsStore;
  if (!goals?.length) return "The user has no goals set yet.";

  const lines = goals.map((g) => {
    const progress =
      g.goalType === "max"
        ? g.currentValue / g.targetValue
        : g.targetValue / g.currentValue;

    const pct = Math.round(progress * 100);

    return `• "${g.title}" — ${g.currentValue}/${g.targetValue} ${g.unit} (${pct}%, type: ${g.goalType})`;
  });

  return `User's current goals:\n${lines.join("\n")}`;
}

export function buildHabitsContext(habitsStore: {
  habits: { title: string; streak: number; lastCompletedDate?: string }[];
}): string {
  const { habits } = habitsStore;
  if (!habits?.length) return "The user has no habits tracked yet.";

  const todayStr = new Date().toISOString().slice(0, 10);

  const lines = habits.map((h) => {
    const completedToday = h.lastCompletedDate?.slice(0, 10) === todayStr;
    return `• "${h.title}" — streak: ${h.streak} day${h.streak !== 1 ? "s" : ""}, today: ${completedToday ? "✓ done" : "✗ pending"}`;
  });

  return `User's habits:\n${lines.join("\n")}`;
}

export function buildHealthContext(healthStore: {
  entries: { date: string; steps?: number; sleep?: number; water?: number; mood?: number }[];
}): string {
  const recent = (healthStore.entries ?? []).slice(-7);
  if (!recent.length) return "The user has no recent health data.";

  const avg = (key: "steps" | "sleep" | "water" | "mood") => {
    const vals = recent.map((e) => e[key]).filter((v): v is number => v != null);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const parts: string[] = [];
  const s = avg("steps");
  const sl = avg("sleep");
  const w = avg("water");
  const m = avg("mood");

  if (s != null) parts.push(`avg ${s.toLocaleString()} steps/day`);
  if (sl != null) parts.push(`avg ${sl}h sleep`);
  if (w != null) parts.push(`avg ${w} glasses water`);
  if (m != null) parts.push(`avg mood ${m}/10`);

  return `User's health (last ${recent.length} days): ${parts.join(", ")}.`;
}

export function buildFinanceContext(financeStore: {
  entries: { date: string; amount: number; category: string; type: "income" | "expense" }[];
  budget?: number;
}): string {
  const recent = (financeStore.entries ?? []).slice(-30);
  if (!recent.length) return "The user has no recent finance data.";

  const expenses = recent.filter((e) => e.type === "expense");
  const income = recent.filter((e) => e.type === "income");

  const totalExpense = expenses.reduce((a, e) => a + e.amount, 0);
  const totalIncome = income.reduce((a, e) => a + e.amount, 0);

  // Top spending category
  const byCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  });
  const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

  let ctx = `User's finances (last 30 days): income $${totalIncome.toFixed(0)}, expenses $${totalExpense.toFixed(0)}.`;
  if (topCat) ctx += ` Top spending: ${topCat[0]} ($${topCat[1].toFixed(0)}).`;
  if (financeStore.budget) ctx += ` Monthly budget: $${financeStore.budget}.`;

  return ctx;
}

export function buildFitnessContext(fitnessStore: {
  fitnessEntries: {
    date: string;
    type: string;
    durationMinutes: number;
    caloriesBurned?: number;
    exercises?: { name: string; sets?: number; reps?: number; weightKg?: number; distanceKm?: number }[];
  }[];
}): string {
  const recent = (fitnessStore.fitnessEntries ?? [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  if (!recent.length) return "The user has no recent fitness entries.";

  const totalWorkouts = recent.length;
  const totalMins = recent.reduce((a, e) => a + e.durationMinutes, 0);
  const totalCals = recent.reduce((a, e) => a + (e.caloriesBurned ?? 0), 0);

  // Workout type breakdown
  const byType: Record<string, number> = {};
  recent.forEach((e) => {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
  });
  const typeBreakdown = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${t} ×${n}`)
    .join(", ");

  // Most recent workout detail
  const latest = recent[0];
  const latestExercises = latest.exercises?.length
    ? latest.exercises
        .slice(0, 3)
        .map((ex) => {
          const parts = [ex.name];
          if (ex.sets && ex.reps) parts.push(`${ex.sets}×${ex.reps}${ex.weightKg ? ` @ ${ex.weightKg}kg` : ""}`);
          if (ex.distanceKm) parts.push(`${ex.distanceKm}km`);
          return parts.join(" ");
        })
        .join(", ")
    : null;

  let ctx = `User's fitness (last ${totalWorkouts} workouts): ${totalMins} total minutes`;
  if (totalCals) ctx += `, ~${totalCals} calories burned`;
  ctx += `. Types: ${typeBreakdown}.`;
  ctx += ` Most recent (${latest.date}): ${latest.type}, ${latest.durationMinutes} min`;
  if (latestExercises) ctx += ` — ${latestExercises}`;
  ctx += ".";

  return ctx;
}

export function buildRelationshipsContext(relationshipsStore: {
  relationships: {
    name: string;
    birthday?: string;
    howWeMet?: string;
    type?: string;
  }[];
}): string {
  const { relationships } = relationshipsStore;
  if (!relationships?.length) return "The user has no relationships tracked.";
 
  const today = new Date();
  const soon: string[] = [];
 
  relationships.forEach((r) => {
    if (!r.birthday) return;
    const bday = new Date(r.birthday);
    bday.setFullYear(today.getFullYear());
    const diff = Math.ceil(
      (bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff >= 0 && diff <= 14) soon.push(`${r.name} in ${diff} day${diff !== 1 ? "s" : ""}`);
  });
 
  const lines = relationships.slice(0, 6).map((r) => {
    const details = [r.type, r.howWeMet ? `met via ${r.howWeMet}` : null]
      .filter(Boolean)
      .join(", ");
    return `• ${r.name}${details ? ` (${details})` : ""}`;
  });
 
  let ctx = `User's relationships:\n${lines.join("\n")}`;
  if (soon.length) ctx += `\nUpcoming birthdays: ${soon.join(", ")}.`;
 
  return ctx;
}

export function buildTodayContext(stores: {
  goals: Parameters<typeof buildGoalsContext>[0];
  habits: Parameters<typeof buildHabitsContext>[0];
  health: Parameters<typeof buildHealthContext>[0];
  fitness: Parameters<typeof buildFitnessContext>[0];
  finance: Parameters<typeof buildFinanceContext>[0];
  relationships: Parameters<typeof buildRelationshipsContext>[0];
}): string {
  return [
    buildGoalsContext(stores.goals),
    buildHabitsContext(stores.habits),
    buildHealthContext(stores.health),
    buildFitnessContext(stores.fitness),
    buildFinanceContext(stores.finance),
    buildRelationshipsContext(stores.relationships),
  ].join("\n\n");
}

// ─── Main export ───────────────────────────────────────────────────────────────

export async function fetchInsight(
  screen: InsightScreen,
  context: string,
  opts: { force?: boolean; userJwt: string }
): Promise<string> {
  if (!opts.force) {
    const cached = await getCachedInsight(screen);
    if (cached) return cached;
  }

  const insight = await callEdgeFunction(screen, context, opts.userJwt);
  await setCachedInsight(screen, insight);
  return insight;
}

export async function generateGoalPlan(
  goal: {
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    deadline: string;
    goalType: "min" | "max" | "binary";
  },
  userJwt: string
): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/ai-goal-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwt}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(goal),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();

  return data.steps ?? [];
}