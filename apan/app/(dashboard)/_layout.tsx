import { Tabs } from 'expo-router';
import 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext } from 'react'; // 1. Importar o 'useContext'
import UserOnly from '@/components/auth/UserOnly';
// 2. Importar o Contexto e o Tipo (em vez de 'Colors' e 'useColorScheme')
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { StatusBar } from 'react-native';

const DashboardLayout = () => {
    // 3. Consumir o tema do contexto (como fizemos no layout pai)
    const themeContext = useContext<ThemeContextType | null>(ThemeContext);
    if (!themeContext) {
        // Isso não deve acontecer se o app/_layout estiver correto
        throw new Error('DashboardLayout must be used within a ThemeProvider');
    }
    const { theme } = themeContext;

    return (
        
        <UserOnly>
            <StatusBar/>
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tint,      // Cor do ícone ativo
                tabBarInactiveTintColor: theme.icon,    // Cor do ícone inativo
                tabBarStyle: {
                    backgroundColor: theme.background, // Cor de fundo da barra
                },
                headerShown: false, // Aplicado a todas as abas
            }}
        >
            <Tabs.Screen 
                name="home" 
                options={{ 
                    tabBarLabel: "Home",
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ), 
                }} 
            />
            
            <Tabs.Screen 
                name="testes" 
                options={{ 
                    tabBarLabel: "Testes",
                    title: "Testes",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="sports-gymnastics" size={size} color={color} />
                    ), 
                }} 
            />
    
            
            <Tabs.Screen 
                name="atletas" 
                options={{ 
                    tabBarLabel: "Atletas",
                    title: "Atletas",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="people" size={size} color={color} />
                    ), 
                }} 
            />


            <Tabs.Screen 
                name="desempenho" 
                options={{ 
                    tabBarLabel: "Desempenho",
                    title: "Desempenho",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="people" size={size} color={color} />
                    ), 
                }} 
            />


            
            <Tabs.Screen 
                name="configuracoes" 
                options={{ 
                    tabBarLabel: "Configurações",
                    title: "Configurações",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color} />
                    ), 
                }} 
            />
        </Tabs>
        </UserOnly>
    );
}

export default DashboardLayout;