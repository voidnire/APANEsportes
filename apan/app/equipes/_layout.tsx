import {Stack} from "expo-router";



export default function RootLayout(){
    return <Stack>  
        <Stack.Screen name="index" options={{ title: 'Equipes' }} />
       {/*} <Stack.Screen name="perfilAtleta" options={({ route }: any) => {
            const id = route?.params?.id;
            return {
                title: id ? `Perfil • ${id}` : "Perfil",
            };
            }}
        />*/}
        <Stack.Screen name="equipe/[id]" options={{title: 'Equipe X'}}
        />


        <Stack.Screen name="registrarDados" options={{ title: 'Registrar Dados' }} />
    </Stack>
}