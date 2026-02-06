import { useTheme } from '@emotion/react';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const theme = useTheme();
  const scheme = useColorScheme(); // optional, if you want to switch manually

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['bottom', 'top']}
    >
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarShowLabel: true, // 🔥 REQUIRED
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: '#888', // hardcode to test

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '300',
            textTransform: 'none', // Android fix
          },

          tabBarStyle: {
            backgroundColor: theme.card,
            height: 60,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            elevation: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarLabel: 'Today',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarLabel: 'Habits',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="calendar-today" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            title: 'Health',
            tabBarLabel: 'Habits',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="health-and-safety" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="finance"
          options={{
            title: 'Finance',
            tabBarLabel: 'Finance',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="wallet" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="overview"
          options={{
            title: 'Overview',
            tabBarLabel: 'Overview',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="show-chart" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
