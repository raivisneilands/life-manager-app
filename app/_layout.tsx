import AppHeader from "@/components/AppHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import { useFinanceStore } from "@/store/FinanceStore";
import { useFitnessStore } from "@/store/FitnessStore";
import { useGoalStore } from "@/store/GoalStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useRelationshipStore } from "@/store/RelationshipStore";
import { useSyncStore } from "@/store/syncStore";
import { useTaskStore } from "@/store/TaskStore";
import { darkTheme, lightTheme } from "@/theme";
import { ThemeProvider } from "@emotion/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export type ThemeMode = "light" | "dark" | "system";

export const ThemeContext = createContext<{
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}>({
  themeMode: "system",
  setThemeMode: () => {},
});

export const OnboardingContext = createContext<{
  completeOnboarding: () => Promise<void>;
}>({
  completeOnboarding: async () => {},
});

const ONBOARDING_KEY = "hasSeenOnboarding";
const THEME_KEY = "themeMode";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

function RootLayoutContent() {
  // ============================================================
  // STORE ACTIONS
  // ============================================================

  const getHabits = useHabitStore((state) => state.getHabits);
  const getHealthEntries = useHealthStore((state) => state.getEntries);
  const getFinanceEntries = useFinanceStore((state) => state.getEntries);
  const getTasks = useTaskStore((state) => state.getTasks);
  const getRelationships = useRelationshipStore(
    (state) => state.getRelationships,
  );
  const getFitnessEntries = useFitnessStore((state) => state.getFitnessEntries);
  const getGoals = useGoalStore((state) => state.getGoals);

  // ============================================================
  // ONBOARDING STATE
  // ============================================================

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  // ============================================================
  // THEME STATE
  // ============================================================

  const systemScheme = useColorScheme();

  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const segments = useSegments();

  const isAuthCallback =
    segments.length >= 2 &&
    segments[0] === "auth" &&
    segments[1] === "callback";

  // ============================================================
  // INITIALIZE STORES
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function initializeStores() {
      try {
        await Promise.all([
          getTasks(),
          getHabits(),
          getHealthEntries(),
          getFinanceEntries(),
          getRelationships(),
          getFitnessEntries(),
          getGoals(),
        ]);

        if (!cancelled) {
          await useSyncStore.getState().init();
        }
      } catch (error) {
        console.error("❌ Failed to initialize stores:", error);
      }
    }

    initializeStores();

    return () => {
      cancelled = true;
    };
  }, [
    getTasks,
    getHabits,
    getHealthEntries,
    getFinanceEntries,
    getRelationships,
    getFitnessEntries,
    getGoals,
  ]);

  // ============================================================
  // CHECK ONBOARDING
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function checkOnboarding() {
      try {
        console.log("🔥 ONBOARDING CHECK START");

        const value = await AsyncStorage.getItem(ONBOARDING_KEY);

        console.log("🔥 ONBOARDING STORAGE VALUE:", value);

        if (!cancelled) {
          const seen = value === "true";

          setHasSeenOnboarding(seen);

          console.log("🔥 HAS SEEN ONBOARDING:", seen);
        }
      } catch (error) {
        console.error("❌ Failed to check onboarding:", error);

        if (!cancelled) {
          // Fail safely by showing onboarding.
          setHasSeenOnboarding(false);
        }
      }
    }

    checkOnboarding();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hasSeenOnboarding !== null) {
      SplashScreen.hideAsync();
    }
  }, [hasSeenOnboarding]);

  // ============================================================
  // LOAD THEME
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadTheme() {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);

        if (cancelled || !saved) {
          return;
        }

        if (saved === "light" || saved === "dark" || saved === "system") {
          setThemeMode(saved);
        }
      } catch (error) {
        console.error("❌ Failed to load theme:", error);
      }
    }

    loadTheme();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // THEME UPDATE
  // ============================================================

  const updateThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);

      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.error("❌ Failed to save theme:", error);
    }
  }, []);

  // ============================================================
  // COMPLETE ONBOARDING
  // ============================================================

  const completeOnboarding = useCallback(async () => {
    try {
      console.log("🔥 COMPLETE ONBOARDING");

      await AsyncStorage.setItem(ONBOARDING_KEY, "true");

      setHasSeenOnboarding(true);

      console.log("🔥 ONBOARDING COMPLETED");

      router.replace("/(tabs)");
    } catch (error) {
      console.error("❌ Failed to complete onboarding:", error);
    }
  }, []);

  // ============================================================
  // RESOLVE THEME
  // ============================================================

  const resolvedScheme = themeMode === "system" ? systemScheme : themeMode;

  const theme = resolvedScheme === "dark" ? darkTheme : lightTheme;

  // ============================================================
  // WAIT FOR ONBOARDING STATE
  // ============================================================

  if (hasSeenOnboarding === null) {
    return null;
  }

  // ============================================================
  // DEBUG
  // ============================================================

  console.log("🔥 ROOT ROUTING STATE:", {
    hasSeenOnboarding,
    themeMode,
    resolvedScheme,
  });

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode: updateThemeMode,
      }}
    >
      <OnboardingContext.Provider
        value={{
          completeOnboarding,
        }}
      >
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: theme.background,
              }}
            >
              {!isAuthCallback && hasSeenOnboarding && <AppHeader />}

              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth/callback" />
              </Stack>
            </SafeAreaView>
          </SafeAreaProvider>
        </ThemeProvider>
      </OnboardingContext.Provider>
    </ThemeContext.Provider>
  );
}
