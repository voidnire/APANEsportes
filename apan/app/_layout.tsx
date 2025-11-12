import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import React, { useContext } from 'react'; // Import React e useContext

// 1. AJUSTE: Todos os imports agora usam o alias @/
import { ThemeProvider, ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';

// 2. AJUSTE: Componente "filho" que consome o contexto
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
      {/* 4. AJUSTE: StatusBar agora é estilizada pelo tema do contexto */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

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
  );
}


// O RootLayout agora SÓ fornece os contextos
export default function RootLayout() {
  // 6. AJUSTE: Removido o cálculo manual do tema daqui

  return (
    <UserProvider>
      <ThemeProvider>
        {/* O componente filho agora faz o trabalho */}
        <RootLayoutNav />
      </ThemeProvider>
    </UserProvider>
  );
}