import { JournalEntry } from "@/models/JournalEntry";
import { useSyncStore } from '@/store/syncStore';
import { syncDelete, syncFetch, syncUpsert } from '@/utils/supabaseSync';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-journal";
const TABLE = "journal_entries";
const isSyncing = () => useSyncStore.getState().syncEnabled;

type JournalStore = {
  entries: JournalEntry[];
  getEntries: () => Promise<void>;
  addEntry: (entry: JournalEntry) => Promise<void>;
  updateEntry: (id: string, content: string) => void;
  removeEntry: (id: string) => Promise<void>;
  clearEntries: () => Promise<void>;
};

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],

  getEntries: async () => {
    if (isSyncing()) {
      const data = await syncFetch<JournalEntry>(TABLE);
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

  updateEntry: (id, content) => {
    const updated = get().entries.map((entry: JournalEntry) =>
      entry.id === id ? { ...entry, content } : entry
    );
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
    if (isSyncing()) {
      const entry = updated.find((e) => e.id === id);
      if (entry) syncUpsert(TABLE, [entry]);
    }
  },

  removeEntry: async (id) => {
    const updated = get().entries.filter((entry: JournalEntry) => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
    if (isSyncing()) await syncDelete(TABLE, id);
  },

  clearEntries: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ entries: [] });
  },
}));