import { useFinanceStore } from "@/store/FinanceStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useTaskStore } from "@/store/TaskStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Bootstrap() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const getHabits = useHabitStore((s) => s.getHabits);
  const getHealthEntries = useHealthStore((s) => s.getEntries);
  const getFinanceEntries = useFinanceStore((s) => s.getEntries);
  const getTasks = useTaskStore((s) => s.getTasks);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        getTasks(),
        getHabits(),
        getHealthEntries(),
        getFinanceEntries(),
      ]);
      router.replace("/(tabs)"); // Navigate to main app
    };
    init();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
