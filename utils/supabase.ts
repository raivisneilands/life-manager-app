import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

export async function deleteAccount(): Promise<{ error: string | null }> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  console.log("session:", session);
  console.log("sessionError:", sessionError);
  console.log("access_token:", session?.access_token);


  if (!session) return { error: "No active session" };

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
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