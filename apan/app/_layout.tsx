import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {ThemeProvider,ThemeContext} from "../context/ThemeContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/Colors'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Stack } from "expo-router"
import { UserProvider } from '@/context/UserContext';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  


  return (
    <UserProvider>
      <StatusBar /> 
      <ThemeProvider>
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
      
      </ThemeProvider>
    </UserProvider>
  );
}
