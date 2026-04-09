import Menu from '@/components/Menu';
import { useFinanceStore } from '@/store/FinanceStore';
import { useFitnessStore } from '@/store/FitnessStore';
import { useHabitStore } from '@/store/HabitStore';
import { useHealthStore } from '@/store/HealthStore';
import { useRelationshipStore } from '@/store/RelationshipStore';
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
  const getRelationships = useRelationshipStore((s) => s.getRelationships);
  const getFitnessEntries = useFitnessStore((s) => s.getFitnessEntries)

  async function init() {
    await getTasks();
    await getHabits();
    await getHealthEntries();
    await getFinanceEntries();
    await getRelationships();
    await getFitnessEntries();
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
          <Menu/>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
