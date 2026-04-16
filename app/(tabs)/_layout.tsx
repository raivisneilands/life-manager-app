import { useTheme } from '@emotion/react';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true, // 🔥 REQUIRED
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: '#888', // hardcode to test

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },

        tabBarStyle: {
          backgroundColor: theme.background,
          borderColor: theme.card,
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          tabBarLabel: 'Habits',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-today" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="health-and-safety" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          tabBarLabel: 'Finance',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="wallet" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="overview"
        options={{
          tabBarLabel: 'Overview',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="show-chart" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="relationships/index" options={{ href: null }} />
      <Tabs.Screen name="relationships/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="fitness"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="settings/privacy" options={{ href: null }} />
      <Tabs.Screen name="settings/terms" options={{ href: null }} />
    </Tabs>
  );
}
