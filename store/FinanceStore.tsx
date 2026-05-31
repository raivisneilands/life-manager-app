import { FinanceEntry } from "@/models/FinanceEntry";
import { useSyncStore } from "@/store/syncStore";
import { syncDelete, syncFetch, syncUpsert } from "@/utils/supabaseSync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-finance";
const TABLE = "finance_entries";
const isSyncing = () => useSyncStore.getState().syncEnabled;

type FinanceStore = {
  entries: FinanceEntry[];
  getEntries: () => Promise<void>;
  addEntry: (entry: FinanceEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  getMonthlyFinance: (month: number, year: number) => FinanceEntry[];
  getDailyFinance: (date: string) => FinanceEntry[];
  clearEntries: () => Promise<void>;
};

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  entries: [],

  getEntries: async () => {
    if (isSyncing()) {
      const data = await syncFetch<FinanceEntry>(TABLE);
      set({ entries: data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ entries: JSON.parse(stored) });
    }
  },

  addEntry: async (entry) => {
    const updated = [...get().entries, entry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
    if (isSyncing()) await syncUpsert(TABLE, [entry]);
  },

  removeEntry: async (id) => {
    const updated = get().entries.filter((e) => e.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
    if (isSyncing()) await syncDelete(TABLE, id);
  },

  getMonthlyFinance: (month: number, year: number) => {
    return get().entries.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  },

  getDailyFinance: (date: string) => {
    return get().entries.filter((e) => e.date.split("T")[0] === date);
  },

  clearEntries: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ entries: [] });
  },
}));
