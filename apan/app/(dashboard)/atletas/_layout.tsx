import {Stack} from "expo-router";

export default function RootLayout(){



    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Atletas',headerShown:false  }} />
       {/*} <Stack.Screen name="perfilAtleta" options={({ route }: any) => {
            const nome = route?.params?.name;
            return {
                title: nome ? `Perfil • ${nome}` : "Perfil",
            };
            }}
        />*/}
        <Stack.Screen name="atleta/[id]" options={({ route }: any) => {
            const nome = route?.params?.name;
            return {
                title: nome ? `${nome}` : "Atleta",
            };
            }}
        />


        <Stack.Screen name="registrarDados" options={{ title: 'Registrar Dados' }} />
    </Stack>
}