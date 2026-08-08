import { useFinanceStore } from "@/store/FinanceStore";
import { useFitnessStore } from "@/store/FitnessStore";
import { useGoalStore } from "@/store/GoalStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useJournalStore } from "@/store/JournalStore";
import { useRelationshipStore } from "@/store/RelationshipStore";
import { useTaskStore } from "@/store/TaskStore";
import { deleteAccount as deleteAccountUtil, supabase } from "@/utils/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  authEvent: AuthChangeEvent | null;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  authEvent: null,
  signOut: async () => {},
  deleteAccount: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEvent, setAuthEvent] = useState<AuthChangeEvent | null>(null);

  useEffect(() => {
    let mounted = true;

    // Initial session restore
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setLoading(false);
    });

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setAuthEvent(event);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async (): Promise<{ error: string | null }> => {
    const { error } = await deleteAccountUtil();
    if (error) return { error };

    await Promise.all([
      useRelationshipStore.getState().clearRelationships(),
      useFitnessStore.getState().clearFitnessEntries(),
      useGoalStore.getState().clearGoals(),
      useTaskStore.getState().clearTasks(),
      useHabitStore.getState().clearHabits(),
      useHealthStore.getState().clearEntries(),
      useFinanceStore.getState().clearEntries(),
      useJournalStore.getState().clearEntries(),
    ]);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{ session, loading, authEvent, signOut, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
