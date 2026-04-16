import { FitnessEntry } from "@/models/FitnessEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-fitness";

type FitnessStore = {
  fitnessEntries: FitnessEntry[];
  getFitnessEntries: () => Promise<void>;
  addFitnessEntry: (fitnessEntry: FitnessEntry) => Promise<void>;
  removeFitnessEntry: (fitnessEntryId: string) => Promise<void>;
  updateFitnessEntry: (fitnessEntry: FitnessEntry) => Promise<void>;
  clearFitnessEntries: () => Promise<void>;
};

export const useFitnessStore = create<FitnessStore>((set, get) => ({
  fitnessEntries: [],

  getFitnessEntries: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ fitnessEntries: JSON.parse(stored) });
    }
  },

  addFitnessEntry: async (fitnessEntry) => {
    const updated = [...get().fitnessEntries, fitnessEntry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ fitnessEntries: updated });
  },

  removeFitnessEntry: async (fitnessEntryId) => {
    const updated = get().fitnessEntries.filter((h) => h.id !== fitnessEntryId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ fitnessEntries: updated });
  },

  updateFitnessEntry: async (fitnessEntry) => {
    const updated = get().fitnessEntries.map((r) => r.id === fitnessEntry.id ? fitnessEntry : r);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ fitnessEntries: updated });
  }, 

  clearFitnessEntries: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ fitnessEntries: [] });
  },
}));
