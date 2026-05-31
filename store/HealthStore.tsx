import { HealthEntry } from "@/models/HealthEntry";
import { useSyncStore } from '@/store/syncStore';
import { syncDelete, syncFetch, syncUpsert } from '@/utils/supabaseSync';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-health";
const TABLE = "health_entries";
const isSyncing = () => useSyncStore.getState().syncEnabled;

type HealthStore = {
  entries: HealthEntry[];
  getEntries: () => Promise<void>;
  addEntry: (entry: HealthEntry) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
  saveEntriesToStorage: (entries: HealthEntry[]) => Promise<void>;
  clearEntries: () => Promise<void>;
};

export const useHealthStore = create<HealthStore>((set, get) => ({
  entries: [],

  getEntries: async () => {
    if (isSyncing()) {
      const data = await syncFetch<HealthEntry>(TABLE);
      set({ entries: data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      set({ entries: JSON.parse(raw ?? '[]') });
    }
  },

  addEntry: async (entry: HealthEntry) => {
    const updated = [...get().entries, entry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
    if (isSyncing()) await syncUpsert(TABLE, [entry]);
  },

  removeEntry: async (entryId: string) => {
    const updated = get().entries.filter((e: HealthEntry) => e.id !== entryId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
    if (isSyncing()) await syncDelete(TABLE, entryId);
  },

  saveEntriesToStorage: async (entries: HealthEntry[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  clearEntries: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ entries: [] });
  },
}));