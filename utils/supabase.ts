import { ENV } from "@/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://apmpmwgaysmcxyppiulf.supabase.co",
  "sb_publishable_1a5lFmvFAR7qVGi5c8pNoA_eN2tNyrv",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export async function deleteAccount(): Promise<{ error: string | null }> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (!session) return { error: "No active session" };

  const res = await fetch(
    `${ENV.supabaseUrl}/functions/v1/delete-account`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return { error: text || "Failed to delete account" };
  }

  return { error: null };
}