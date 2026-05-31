import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

const SYNC_KEY = 'sync_enabled'

interface SyncStore {
  syncEnabled: boolean
  hydrated: boolean
  init: () => Promise<void>
  setSyncEnabled: (val: boolean) => Promise<void>
}

export const useSyncStore = create<SyncStore>((set) => ({
  syncEnabled: false,
  hydrated: false,

  init: async () => {
    const val = await AsyncStorage.getItem(SYNC_KEY)
    set({ syncEnabled: val === 'true', hydrated: true })
  },

  setSyncEnabled: async (val) => {
    await AsyncStorage.setItem(SYNC_KEY, String(val))
    set({ syncEnabled: val })
  },
}))