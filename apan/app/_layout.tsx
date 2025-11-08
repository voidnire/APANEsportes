import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {ThemeProvider,ThemeContext} from "../context/ThemeContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/Colors'; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = Colors[colorScheme ?? 'light'];

  return (
    <ThemeProvider>
      <Tabs screenOptions={{tabBarActiveTintColor:"teal",
        tabBarStyle: {
            backgroundColor: currentTheme.background, // Cor de fundo da barra de abas
        },



      }} >

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

        <Tabs.Screen name ="atletas" options={{ tabBarLabel:"Atletas", //href ="null" vai esconde, tabBarBadge:3,
          headerShown:false,title:"Atletas",
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
