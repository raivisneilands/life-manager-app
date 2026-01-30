import { HealthEntry } from "@/models/HealthEntry";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const healthStorage = createAsyncStorage("life-manager-health");

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
    const stored = await healthStorage.getItem("entries");
    if (stored) set({ entries: JSON.parse(stored) });
  },
  addEntry: async (entry: HealthEntry) => {
    set((state: any) => {
      const updated = [...state.entries, entry];
      healthStorage.setItem("entries", JSON.stringify(updated));
      return { entries: updated };
    });
  },
  removeEntry: async (entryId: string) => {
    set((state: any) => {
      const updated = state.entries.filter(
        (e: HealthEntry) => e.id !== entryId,
      );
      healthStorage.setItem("entries", JSON.stringify(updated));
      return { entries: updated };
    });
  },
  saveEntriesToStorage: async (entries: HealthEntry[]) => {
    await healthStorage.setItem("entries", JSON.stringify(entries));
  },
}));
