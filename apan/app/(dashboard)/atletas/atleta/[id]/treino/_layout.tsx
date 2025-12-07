import {Stack} from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout(){



    return <Stack>  
        <StatusBar/>
        {/**<Stack.Screen name="index" options={{ title: 'Treino',headerShown:false  }} /> */}
        <Stack.Screen name="index" options={{ title: 'Registrar Treino', headerShown:false }} />
    
        <Stack.Screen name="analise" options={{ title: 'Análise', headerShown:false }} />
    </Stack>
}