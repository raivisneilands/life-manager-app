import { HealthEntry } from "@/models/HealthEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-health";

type HealthStore = {
  entries: HealthEntry[];
  getEntries: () => Promise<void>;
  addEntry: (entry: HealthEntry) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
  saveEntriesToStorage: (entries: HealthEntry[]) => Promise<void>;
};

export const useHealthStore = create<HealthStore>((set) => ({
  entries: [],
  getEntries: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) set({ entries: JSON.parse(stored) });
  },
  addEntry: async (entry: HealthEntry) => {
    set((state: any) => {
      const updated = [...state.entries, entry];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { entries: updated };
    });
  },
  removeEntry: async (entryId: string) => {
    set((state: any) => {
      const updated = state.entries.filter(
        (e: HealthEntry) => e.id !== entryId,
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { entries: updated };
    });
  },
  saveEntriesToStorage: async (entries: HealthEntry[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },
}));
