import {Stack, useLocalSearchParams, useRouter} from "expo-router";



export default function RootLayout(){
    const router = useRouter();
    const params = useLocalSearchParams();


    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Equipes', }} />
       {/*} <Stack.Screen name="perfilAtleta" options={({ route }: any) => {
            const id = route?.params?.id;
            return {
                title: id ? `Perfil • ${id}` : "Perfil",
            };
            }}
        />*/}
        <Stack.Screen name="equipe/[id]" options={{title: params.name ? `Equipe ${params.name}` : 'Equipe GAY',}}
        />


        <Stack.Screen name="registrarDados" options={{ title: 'Registrar Dados' }} />
    </Stack>
}