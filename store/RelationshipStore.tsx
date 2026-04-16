import { Relationship } from "@/models/Relationship";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "life-manager-relationships";

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
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      set({ relationships: JSON.parse(stored) });
    }
  },

  addRelationship: async (relationship) => {
    const updated = [...get().relationships, relationship];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ relationships: updated });
  },

  removeRelationship: async (relationshipId) => {
    const updated = get().relationships.filter((h) => h.id !== relationshipId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ relationships: updated });
  },

  updateRelationship: async (relationship) => {
    const updated = get().relationships.map((r) => r.id === relationship.id ? relationship : r);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ relationships: updated });
  },
  
  clearRelationships: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ relationships: [] });
  }
}));
