import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncFetch, syncUpsert } from './supabaseSync';

// Map each store's AsyncStorage key to its Supabase table
const STORE_MAP: { key: string; table: string }[] = [
  { key: 'life-manager-relationships', table: 'relationships' },
  { key: 'life-manager-goals',         table: 'goals' },
  { key: 'life-manager-fitness',       table: 'fitness_entries' },
  { key: 'life-manager-habits',        table: 'habits' },
  { key: 'life-manager-tasks',         table: 'tasks' },
  { key: 'life-manager-health',        table: 'health_entries' },
  { key: 'life-manager-finance',       table: 'finance_entries' },
  { key: 'life-manager-journal',       table: 'journal_entries' },
]

// Upload local → Supabase
export async function uploadLocalToSupabase() {
  for (const { key, table } of STORE_MAP) {
    const raw = await AsyncStorage.getItem(key)
    const records = raw ? JSON.parse(raw) : []
    if (records.length > 0) await syncUpsert(table, records)
  }
}

// Replace local with Supabase data
export async function downloadSupabaseToLocal() {
  for (const { key, table } of STORE_MAP) {
    const records = await syncFetch(table)
    await AsyncStorage.setItem(key, JSON.stringify(records))
  }
}