import {Stack} from "expo-router";


export default function RootLayout(){
    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Testes',headerShown:false  }} />
        <Stack.Screen name="registrarTreino" options={{ title: 'Registrar Treino', headerShown:false }} />
        <Stack.Screen name="analise" options={{ title: 'Análise', headerShown:false }} />

    </Stack>
}