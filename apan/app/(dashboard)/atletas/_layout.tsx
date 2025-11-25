import {Stack} from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout(){



    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Atletas',headerShown:false  }} />
        <StatusBar/>
       {/*} <Stack.Screen name="perfilAtleta" options={({ route }: any) => {
            const nome = route?.params?.name;
            return {
                title: nome ? `Perfil • ${nome}` : "Perfil",
            };
            }}
        />*/}
        <Stack.Screen name="atleta/[id]/index" options={({ route }: any) => {
            const nome = route?.params?.name;
            return {
                title: nome ? `${nome}` : "Atleta",
                headerShown: false,
            };
            }}
        />

        <Stack.Screen name="atleta/[id]/desempenho" options={{headerShown: false}}/>


        <Stack.Screen name="registrarDados" options={{ title: 'Registrar Dados', headerShown:false }} />
    </Stack>
}