import { Goal, PlanStep } from '@/models/Goal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'life-manager-goals';

type GoalStore = {
  goals: Goal[];
  getGoals: () => Promise<void>;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  addPlanStep: (goalId: string, step: PlanStep) => Promise<void>;
  removePlanStep: (goalId: string, stepId: string) => Promise<void>;
  togglePlanStep: (goalId: string, stepId: string) => Promise<void>;
  clearGoals: () => Promise<void>;
};

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],

  getGoals: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) set({ goals: JSON.parse(stored) });
  },

  addGoal: async (goal) => {
    const updated = [...get().goals, goal];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
  },

  updateGoal: async (goal) => {
    const updated = get().goals.map((g) => (g.id === goal.id ? goal : g));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
  },

  removeGoal: async (id) => {
    const updated = get().goals.filter((g) => g.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
  },

  addPlanStep: async (goalId, step) => {
    const updated = get().goals.map((g) =>
      g.id === goalId ? { ...g, planSteps: [...g.planSteps, step] } : g
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
  },

  removePlanStep: async (goalId, stepId) => {
    const updated = get().goals.map((g) =>
      g.id === goalId
        ? { ...g, planSteps: g.planSteps.filter((s) => s.id !== stepId) }
        : g
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
  },

  togglePlanStep: async (goalId, stepId) => {
    const updated = get().goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            planSteps: g.planSteps.map((s) =>
              s.id === stepId ? { ...s, completed: !s.completed } : s
            ),
          }
        : g
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ goals: updated });
  },

  clearGoals: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ goals: [] });
  },
}));