import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="addition"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="subtraction"
        options={{
          title: 'Subtract',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="minus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="multiplication"
        options={{
          title: 'Multiply',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="xmark.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="puzzle"
        options={{
          title: 'Puzzle',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="puzzlepiece.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
