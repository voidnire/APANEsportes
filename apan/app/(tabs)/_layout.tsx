// Arquivo: app/(tabs)/_layout.tsx (ESTE É UM NOVO ARQUIVO)

import React from 'react';
import { Tabs } from 'expo-router';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Cores baseadas na sua imagem
const ACTIVE_COLOR = '#00A3E0';
const INACTIVE_COLOR = '#8A8A8E';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false, // Oculta o cabeçalho padrão em todas as telas de abas
      }}
    >
      <Tabs.Screen
        name="index" // Corresponde ao arquivo app/(tabs)/index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register" // Corresponde ao arquivo app/(tabs)/register.tsx
        options={{
          title: 'Register',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="clipboard-list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard" // Corresponde ao arquivo app/(tabs)/dashboard.tsx
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings" // Corresponde ao arquivo app/(tabs)/settings.tsx
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}