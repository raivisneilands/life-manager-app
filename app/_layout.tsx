import { useFinanceStore } from "@/store/FinanceStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useTaskStore } from "@/store/TaskStore";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const getHabits = useHabitStore((s) => s.getHabits);
  const getHealthEntries = useHealthStore((s) => s.getEntries);
  const getFinanceEntries = useFinanceStore((s) => s.getEntries);
  const getTasks = useTaskStore((s) => s.getTasks);

  async function init() {
    await getTasks();
    await getHabits();
    await getHealthEntries();
    await getFinanceEntries();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
