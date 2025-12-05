import {Stack} from "expo-router";
import {StatusBar} from "react-native"

export default function RootLayout(){
    return <Stack>  ]
         <StatusBar/>
        <Stack.Screen name="index" options={{ title: 'Seleção Vídeo',headerShown:false  }} />
        <Stack.Screen name="calibracao" options={{ title: 'Calibração', headerShown:false }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard', headerShown:false }} />

    </Stack>
}