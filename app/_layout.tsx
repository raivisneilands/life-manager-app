import { useFinanceStore } from '@/store/FinanceStore';
import { useHabitStore } from '@/store/HabitStore';
import { useHealthStore } from '@/store/HealthStore';
import { useTaskStore } from '@/store/TaskStore';
import { darkTheme, lightTheme } from '@/theme';
import { ThemeProvider } from '@emotion/react';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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

  const scheme = useColorScheme();

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
