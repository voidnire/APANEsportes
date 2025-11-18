import {Stack} from "expo-router";
import { StatusBar } from "react-native";

export default function Layout(){
    return <Stack>
        <StatusBar/>
        
        <Stack.Screen name="index" options={{ title: 'Home',headerShown:false }} />

    </Stack>
}