import { Habit } from "@/models/Habit";
import { useSyncStore } from '@/store/syncStore';
import { syncDelete, syncFetch, syncUpsert } from '@/utils/supabaseSync';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-habits";
const TABLE = "habits";
const isSyncing = () => useSyncStore.getState().syncEnabled;

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
    if (isSyncing()) {
      const data = await syncFetch<Habit>(TABLE);
      set({ habits: data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ habits: JSON.parse(stored) });
    }
  },

  addHabit: async (habit) => {
    const updated = [...get().habits, habit];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ habits: updated });
    if (isSyncing()) await syncUpsert(TABLE, [habit]);
  },

  removeHabit: async (habitId) => {
    const updated = get().habits.filter((h) => h.id !== habitId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ habits: updated });
    if (isSyncing()) await syncDelete(TABLE, habitId);
  },

  toggleHabitCompletion: async (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    const updated = get().habits.map((habit) => {
      if (habit.id !== habitId) return habit;

      if (habit.lastCompletedDate === today) {
        return {
          ...habit,
          lastCompletedDate: undefined,
          streak: Math.max(0, habit.streak - 1),
        };
      }

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
    if (isSyncing()) {
      const toggled = updated.find((h) => h.id === habitId);
      if (toggled) await syncUpsert(TABLE, [toggled]);
    }
  },

  clearHabits: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ habits: [] });
  },
}));