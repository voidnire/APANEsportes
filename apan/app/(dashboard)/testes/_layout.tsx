import {Stack} from "expo-router";


export default function RootLayout(){
    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Testes',headerShown:false  }} />
        <Stack.Screen name="login" options={{ title: 'Login IGNORE' }} />
    </Stack>
}