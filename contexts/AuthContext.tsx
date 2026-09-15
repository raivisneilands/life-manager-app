import { useFinanceStore } from "@/store/FinanceStore";
import { useFitnessStore } from "@/store/FitnessStore";
import { useGoalStore } from "@/store/GoalStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useJournalStore } from "@/store/JournalStore";
import { useRelationshipStore } from "@/store/RelationshipStore";
import { useTaskStore } from "@/store/TaskStore";

import {
  initializeBilling,
  logoutBilling,
  syncRevenueCatPro,
} from "@/utils/billing";

import { deleteAccount as deleteAccountUtil, supabase } from "@/utils/supabase";

import { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  authEvent: AuthChangeEvent | null;
  isPro: boolean;
  syncProStatus: () => Promise<boolean>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error: string | null }>;
  refreshProStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  authEvent: null,
  isPro: false,
  signOut: async () => {},
  syncProStatus: async () => false,
  deleteAccount: async () => ({ error: null }),
  refreshProStatus: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authEvent, setAuthEvent] = useState<AuthChangeEvent | null>(null);
  const [isPro, setIsPro] = useState(false);

  /**
   * Load the user's Pro status from Supabase.
   *
   * IMPORTANT:
   * This function does NOT initialize RevenueCat.
   *
   * Supabase profiles.is_pro is the application's source of truth.
   * RevenueCat is only used for billing and entitlement synchronization.
   */
  const loadProfile = async (userId: string) => {
    try {
      console.log("AUTH: loading profile", userId);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("AUTH: failed to load profile:", error);

        setIsPro(false);
        return;
      }

      if (!profile) {
        console.warn(`AUTH: no profile found for user ${userId}`);

        setIsPro(false);
        return;
      }

      const userIsPro = profile.is_pro === true;

      setIsPro(userIsPro);

      console.log("AUTH: profile loaded", {
        isPro: userIsPro,
      });
    } catch (error) {
      console.error("AUTH: profile loading failed:", error);

      setIsPro(false);
    }
  };

  /**
   * Initialize RevenueCat separately from authentication.
   *
   * RevenueCat must NEVER block the app's authentication loading state.
   */
  const initializeRevenueCat = async (userId: string) => {
    try {
      console.log("AUTH: initializing RevenueCat", userId);

      await initializeBilling(userId);

      console.log("AUTH: RevenueCat initialized");
    } catch (error) {
      console.error("AUTH: RevenueCat initialization failed:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    /**
     * Initial session restore.
     *
     * Authentication and Supabase profile loading happen first.
     * RevenueCat initialization happens separately and does NOT
     * block setLoading(false).
     */
    const initializeAuth = async () => {
      console.log("AUTH: starting initial session restore");

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AUTH: getSession failed:", error);

          if (mounted) {
            setIsPro(false);
            setLoading(false);
          }

          return;
        }

        if (!mounted) return;

        setSession(session);

        if (session?.user?.id) {
          console.log("AUTH: session found", session.user.id);

          // Load the application's Pro status from Supabase.
          await loadProfile(session.user.id);

          if (!mounted) return;

          // Authentication is now ready.
          setLoading(false);

          // Initialize RevenueCat separately.
          // This cannot block the application.
          void initializeRevenueCat(session.user.id);
        } else {
          console.log("AUTH: no active session");

          setIsPro(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("AUTH: initial auth initialization failed:", error);

        if (mounted) {
          setIsPro(false);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    /**
     * Auth state listener.
     *
     * Keep this callback lightweight.
     * We do not await Supabase profile queries directly inside
     * the Supabase auth callback.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      console.log("AUTH EVENT:", event);

      setSession(session);
      setAuthEvent(event);

      setTimeout(() => {
        if (!mounted) return;

        if (session?.user?.id) {
          const userId = session.user.id;

          console.log("AUTH: processing auth event for user", userId);

          void (async () => {
            await loadProfile(userId);

            if (!mounted) return;

            void initializeRevenueCat(userId);
          })();
        } else {
          setIsPro(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Synchronize the user's Pro status.
   *
   * The Edge Function independently checks RevenueCat,
   * updates profiles.is_pro, and returns the resulting state.
   */
  const syncProStatus = async (): Promise<boolean> => {
    if (!session?.user?.id || !session.access_token) {
      setIsPro(false);
      return false;
    }

    console.log("AUTH: starting server-side Pro synchronization");

    const serverIsPro = await syncRevenueCatPro(session.access_token);

    console.log("AUTH: server-side Pro synchronization result:", serverIsPro);

    // Read the authoritative value back from Supabase.
    // This does NOT initialize RevenueCat again.
    await loadProfile(session.user.id);

    return serverIsPro;
  };

  /**
   * Refresh Pro status directly from Supabase.
   */
  const refreshProStatus = async () => {
    if (!session?.user?.id) {
      setIsPro(false);
      return;
    }

    await loadProfile(session.user.id);
  };

  /**
   * Sign out.
   */
  const signOut = async () => {
    try {
      await logoutBilling();
    } catch (error) {
      console.error("RevenueCat logout failed:", error);
    }

    await supabase.auth.signOut();

    setSession(null);
    setIsPro(false);
  };

  /**
   * Delete account.
   */
  const deleteAccount = async (): Promise<{
    error: string | null;
  }> => {
    const { error } = await deleteAccountUtil();

    if (error) {
      return { error };
    }

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

    try {
      await logoutBilling();
    } catch (error) {
      console.error("RevenueCat logout failed:", error);
    }

    setSession(null);
    setIsPro(false);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        authEvent,
        isPro,
        signOut,
        deleteAccount,
        refreshProStatus,
        syncProStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
