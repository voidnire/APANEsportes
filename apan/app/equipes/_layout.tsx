import {Stack} from "expo-router";



export default function RootLayout(){
    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Equipes' }} />
        <Stack.Screen name="perfilAtleta" options={{ title: 'Perfil' }} />

        <Stack.Screen name="registrarDados" options={{ title: 'Registrar Dados' }} />
    </Stack>
}