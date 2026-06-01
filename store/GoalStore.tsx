import { Goal, PlanStep } from "@/models/Goal";
import { useSyncStore } from "@/store/syncStore";
import { syncDelete, syncFetch, syncUpsert } from "@/utils/supabaseSync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-goals";
const TABLE = "goals";
const isSyncing = () => useSyncStore.getState().syncEnabled;

type GoalStore = {
  goals: Goal[];
  getGoals: () => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  addPlanStep: (goalId: string, step: PlanStep) => Promise<void>;
  setPlanSteps: (goalId: string, steps: PlanStep[]) => Promise<void>;
  removePlanStep: (goalId: string, stepId: string) => Promise<void>;
  togglePlanStep: (goalId: string, stepId: string) => Promise<void>;
  clearGoals: () => Promise<void>;
};

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],

  getGoals: async () => {
    if (isSyncing()) {
      const data = await syncFetch<Goal>(TABLE);
      set({ goals: data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ goals: JSON.parse(stored) });
    }
  },

  addGoal: async (goal) => {
    const updated = [...get().goals, goal];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
    if (isSyncing()) await syncUpsert(TABLE, [goal]);
  },

  updateGoal: async (goal) => {
    const updated = get().goals.map((g) => (g.id === goal.id ? goal : g));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
    if (isSyncing()) await syncUpsert(TABLE, [goal]);
  },

  removeGoal: async (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
    if (isSyncing()) await syncDelete(TABLE, id);
  },

  addPlanStep: async (goalId, step) => {
    const updated = get().goals.map((g) =>
      g.id === goalId ? { ...g, planSteps: [...g.planSteps, step] } : g,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
    if (isSyncing()) {
      const goal = updated.find((g) => g.id === goalId);
      if (goal) await syncUpsert(TABLE, [goal]);
    }
  },

  setPlanSteps: async (goalId: string, steps: PlanStep[]) => {
    const updated = get().goals.map((g) =>
      g.id === goalId ? { ...g, planSteps: steps } : g,
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });

    if (isSyncing()) {
      const goal = updated.find((g) => g.id === goalId);
      if (goal) await syncUpsert(TABLE, [goal]);
    }
  },

  removePlanStep: async (goalId, stepId) => {
    const updated = get().goals.map((g) =>
      g.id === goalId
        ? { ...g, planSteps: g.planSteps.filter((s) => s.id !== stepId) }
        : g,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
    if (isSyncing()) {
      const goal = updated.find((g) => g.id === goalId);
      if (goal) await syncUpsert(TABLE, [goal]);
    }
  },

  togglePlanStep: async (goalId, stepId) => {
    const updated = get().goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            planSteps: g.planSteps.map((s) =>
              s.id === stepId ? { ...s, completed: !s.completed } : s,
            ),
          }
        : g,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
    if (isSyncing()) {
      const goal = updated.find((g) => g.id === goalId);
      if (goal) await syncUpsert(TABLE, [goal]);
    }
  },

  clearGoals: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ goals: [] });
  },
}));
