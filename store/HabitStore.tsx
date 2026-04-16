import { Habit } from "@/models/Habit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-habits";

type HabitStore = {
  habits: Habit[];
  getHabits: () => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string) => Promise<void>;
  clearHabits: () => Promise<void>;
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],

  getHabits: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ habits: JSON.parse(stored) });
    }
  },

  addHabit: async (habit) => {
    const updated = [...get().habits, habit];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ habits: updated });
  },

  removeHabit: async (habitId) => {
    const updated = get().habits.filter((h) => h.id !== habitId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ habits: updated });
  },

  toggleHabitCompletion: async (habitId) => {
    const today = new Date().toISOString().split("T")[0];

    const updated = get().habits.map((habit) => {
      if (habit.id !== habitId) return habit;

      // Undo if already completed today
      if (habit.lastCompletedDate === today) {
        return {
          ...habit,
          lastCompletedDate: undefined,
          streak: Math.max(0, habit.streak - 1),
        };
      }

      // Check if streak continues
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const ymdYesterday = yesterday.toISOString().split("T")[0];

      const continuesStreak = habit.lastCompletedDate === ymdYesterday;

      return {
        ...habit,
        lastCompletedDate: today,
        streak: continuesStreak ? habit.streak + 1 : 1,
      };
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ habits: updated });
  },

  clearHabits: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ habits: [] });
  },
}));
