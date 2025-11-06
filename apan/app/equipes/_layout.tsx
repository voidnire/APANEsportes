import {Stack, useLocalSearchParams, useRouter} from "expo-router";

export default function RootLayout(){
    const router = useRouter();
    const params = useLocalSearchParams();


    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Equipes', }} />
       {/*} <Stack.Screen name="perfilAtleta" options={({ route }: any) => {
            const nome = route?.params?.name;
            return {
                title: nome ? `Perfil • ${nome}` : "Perfil",
            };
            }}
        />*/}
        <Stack.Screen name="equipe/[id]" options={({ route }: any) => {
            const nome = route?.params?.name;
            return {
                title: nome ? `Equipe ${nome}` : "Equipe",
            };
            }}
        />


        <Stack.Screen name="registrarDados" options={{ title: 'Registrar Dados' }} />
    </Stack>
}