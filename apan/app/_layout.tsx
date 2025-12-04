import { StatusBar } from 'react-native'; 
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import React, { useContext } from 'react'; // Import React e useContext

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 1. AJUSTE: Todos os imports agora usam o alias @/
import { ThemeProvider, ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { AtletasProvider } from '@/context/AtletasContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function RootLayoutNav() {
  // 3. AJUSTE: Consumindo o contexto da forma correta
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    // Este erro não deve acontecer se o ThemeProvider estiver acima
    throw new Error('RootLayoutNav must be used within a ThemeProvider');
  }

  const { theme, colorScheme } = themeContext;

  return (
    <>
      <StatusBar/>

      {/* 5. AJUSTE: Stack agora usa o tema DO CONTEXTO */}
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.title,
      }}>
        {/* Groups */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />

        {/* Individual Screens */}
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </>
  );}


// O RootLayout agora SÓ fornece os contextos
export default function RootLayout() {
  // 6. AJUSTE: Removido o cálculo manual do tema daqui

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AtletasProvider>
        <ThemeProvider>
          {/* O componente filho agora faz o trabalho */}
          <RootLayoutNav />
        </ThemeProvider></AtletasProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}