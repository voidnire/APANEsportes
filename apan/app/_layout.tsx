import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {ThemeProvider} from "../context/ThemeContext";
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="perfilAtleta" options={{ title: 'Home' }} />

        <Stack.Screen name="registrarDados" options={{ title: 'Home' }} />

        <Stack.Screen name="configuracoes" options={{ title: 'Home' }} />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
