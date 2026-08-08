import AppHeader from "@/components/AppHeader";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
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
  completeOnboarding: () => void;
}>({
  completeOnboarding: () => {},
});

const ONBOARDING_KEY = "hasSeenOnboarding";

export default function RootLayout() {
  // ---- STORES INIT ----
  const getHabits = useHabitStore((s) => s.getHabits);
  const getHealthEntries = useHealthStore((s) => s.getEntries);
  const getFinanceEntries = useFinanceStore((s) => s.getEntries);
  const getTasks = useTaskStore((s) => s.getTasks);
  const getRelationships = useRelationshipStore((s) => s.getRelationships);
  const getFitnessEntries = useFitnessStore((s) => s.getFitnessEntries);
  const getGoals = useGoalStore((s) => s.getGoals);

  const { session } = useAuth();

  async function init() {
    await getTasks();
    await getHabits();
    await getHealthEntries();
    await getFinanceEntries();
    await getRelationships();
    await getFitnessEntries();
    await getGoals();
    await useSyncStore.getState().init();
  }

  useEffect(() => {
    init();
  }, []);

  // ---- ONBOARDING LOGIC ----
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(seen === "true");
    })();
  }, []);

  const completeOnboarding = async () => {
    setHasSeenOnboarding(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(tabs)");
  };

  useEffect(() => {
    if (hasSeenOnboarding !== null) {
      SplashScreen.hideAsync();
    }
  }, [hasSeenOnboarding]);

  // ---- THEME LOGIC ----
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  // load saved preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("themeMode");
      if (saved) setThemeMode(saved as ThemeMode);
    })();
  }, []);

  // persist preference
  const updateThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem("themeMode", mode);
  };

  // listen to system changes (only matters in "system" mode)
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      forceUpdate((x) => x + 1);
    });
    return () => sub.remove();
  }, []);

  // resolve final theme
  const resolvedScheme = themeMode === "system" ? systemScheme : themeMode;

  const theme = resolvedScheme === "dark" ? darkTheme : lightTheme;

  // ---- RENDER ----
  return (
    <AuthProvider>
      <ThemeContext.Provider
        value={{ themeMode, setThemeMode: updateThemeMode }}
      >
        <OnboardingContext.Provider value={{ completeOnboarding }}>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <SafeAreaView
                style={{ flex: 1, backgroundColor: theme.background }}
              >
                {hasSeenOnboarding && <AppHeader />}

                {hasSeenOnboarding !== null && (
                  <Stack
                    screenOptions={{ headerShown: false }}
                    initialRouteName={
                      hasSeenOnboarding ? "(tabs)" : "onboarding"
                    }
                  >
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                )}
              </SafeAreaView>
            </SafeAreaProvider>
          </ThemeProvider>
        </OnboardingContext.Provider>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}
