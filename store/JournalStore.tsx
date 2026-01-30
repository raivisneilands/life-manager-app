import { JournalEntry } from "@/models/JournalEntry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-journal";

type JournalStore = {
  entries: JournalEntry[];
  getEntries: () => Promise<void>;
  addEntry: (entry: JournalEntry) => Promise<void>;
  updateEntry: (id: string, content: string) => void;
  removeEntry: (id: string) => Promise<void>;
};

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],

  getEntries: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ entries: JSON.parse(stored) });
    }
  },

  addEntry: async (entry) => {
    const updated = [...get().entries, entry];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ entries: updated });
  },

  updateEntry: (id, content) =>
    set((state) => {
      const updatedEntries = state.entries.map((entry: JournalEntry) =>
        entry.id === id ? { ...entry, content } : entry,
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      return { entries: updatedEntries };
    }),

  removeEntry: async (id) => {
    set((state) => {
      const updatedEntries = state.entries.filter(
        (entry: JournalEntry) => entry.id !== id,
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      return { entries: updatedEntries };
    });
  },
}));
