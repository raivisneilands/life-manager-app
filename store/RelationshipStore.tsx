import { Relationship } from "@/models/Relationship";
import { useSyncStore } from '@/store/syncStore';
import { syncDelete, syncFetch, syncUpsert } from '@/utils/supabaseSync';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-relationships";
const TABLE = "relationships";
const isSyncing = () => useSyncStore.getState().syncEnabled;

type RelationshipStore = {
  relationships: Relationship[];
  getRelationships: () => Promise<void>;
  addRelationship: (relationship: Relationship) => Promise<void>;
  removeRelationship: (relationshipId: string) => Promise<void>;
  updateRelationship: (relationship: Relationship) => Promise<void>;
  clearRelationships: () => Promise<void>;
};

export const useRelationshipStore = create<RelationshipStore>((set, get) => ({
  relationships: [],

  getRelationships: async () => {
    if (isSyncing()) {
      const data = await syncFetch<Relationship>(TABLE);
      set({ relationships: data });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      set({ relationships: JSON.parse(raw ?? '[]') });
    }
  },

  addRelationship: async (relationship) => {
    const updated = [...get().relationships, relationship];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ relationships: updated });
    if (isSyncing()) await syncUpsert(TABLE, [relationship]);
  },

  removeRelationship: async (relationshipId) => {
    const updated = get().relationships.filter((r) => r.id !== relationshipId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ relationships: updated });
    if (isSyncing()) await syncDelete(TABLE, relationshipId);
  },

  updateRelationship: async (relationship) => {
    const updated = get().relationships.map((r) =>
      r.id === relationship.id ? relationship : r
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ relationships: updated });
    if (isSyncing()) await syncUpsert(TABLE, [relationship]);
  },

  clearRelationships: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ relationships: [] });
  },
}));