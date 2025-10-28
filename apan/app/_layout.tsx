import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {ThemeProvider} from "../context/ThemeContext";
import { useColorScheme } from '@/hooks/use-color-scheme';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <Tabs screenOptions={{tabBarActiveTintColor:"teal"}} >
        {/* <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="perfilAtleta" options={{ title: 'Home' }} />

        <Stack.Screen name="registrarDados" options={{ title: 'Home' }} />

        <Stack.Screen name="configuracoes" options={{ title: 'Home' }} />
        <Stack.Screen name="desempenho" options={{ title: 'Home' }} />*/}
          <Tabs.Screen name ="(home)" 
          options={{ tabBarLabel:"Home", //href ="null" vai esconde, tabBarBadge:3,
          headerShown:false,
          title:"Home",
          tabBarIcon: ({color,size})=>{
          return <MaterialIcons name="home" size={size} color={color} />
        }, 
        }} />

        
        <Tabs.Screen name ="testes" options={{ tabBarLabel:"Testes", //href ="null" vai esconde, tabBarBadge:3,
          headerShown:false, title:"Testes",
          tabBarIcon: ({color,size})=>{
          return <MaterialIcons name="sports-gymnastics" size={size} color={color} />
        }, 
        }} />

      
        <Tabs.Screen name ="desempenho" options={{ tabBarLabel:"Desempenho", //href ="null" vai esconde, tabBarBadge:3,
          headerShown:false,title:"Desempenho",
          tabBarIcon: ({color,size})=>{
          return <MaterialIcons name="area-chart" size={size} color={color} />
        }, 
        }} />

        <Tabs.Screen name ="equipes" options={{ tabBarLabel:"Equipes", //href ="null" vai esconde, tabBarBadge:3,
          headerShown:false,title:"Equipes",
          tabBarIcon: ({color,size})=>{
          return <MaterialIcons name="people" size={size} color={color} />
        }, 
        }} />

        <Tabs.Screen name ="configuracoes" options={{ tabBarLabel:"Configurações", //href ="null" vai esconde, tabBarBadge:3,
          headerShown:false,title:"Configurações",
          tabBarIcon: ({color,size})=>{
          return <MaterialIcons name="settings" size={size} color={color} />
        }, 
        }} />


      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
