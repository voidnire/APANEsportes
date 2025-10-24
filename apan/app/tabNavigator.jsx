import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from './index'; 

const RegisterScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Register Screen</Text>
  </View>
);

const DashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Dashboard Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen</Text>
  </View>
);
// --- Fim das telas de placeholder ---

const Tab = createBottomTabNavigator();

// Cores baseadas na sua imagem
const ACTIVE_COLOR = '#00A3E0'; // Azul/Ciano da imagem
const INACTIVE_COLOR = '#8A8A8E'; // Cinza padrão

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // --- Definição dos Ícones ---
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            const IconComponent = Icon; // Usando Ionicons
            iconName = focused ? 'home' : 'home-outline';
            return <IconComponent name={iconName} size={size} color={color} />;

          } else if (route.name === 'Register') {
            const IconComponent = FontAwesome5; // Usando FontAwesome5
            iconName = 'clipboard-list';
            return <IconComponent name={iconName} size={size} color={color} />;

          } else if (route.name === 'Dashboard') {
            const IconComponent = FontAwesome5; // Usando FontAwesome5
            iconName = 'chart-bar';
            return <IconComponent name={iconName} size={size} color={color} />;
            
          } else if (route.name === 'Settings') {
            const IconComponent = Icon; // Usando Ionicons
            iconName = focused ? 'settings' : 'settings-outline';
            return <IconComponent name={iconName} size={size} color={color} />;
          }
        },

        // --- Definição das Cores ---
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        
        // --- Estilos de Texto ---
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        // --- Estilos da Barra ---
        tabBarStyle: {
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60, // Altura da barra
          paddingBottom: 5,
        },
        
        // --- Opção para esconder o cabeçalho de cada tela ---
        // Descomente se você não quiser o título da tela no topo
        headerShown: false,
      })}
    >
      {/* --- Definição das Telas --- */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;