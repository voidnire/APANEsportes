import { useMutation, useQueryClient } from '@tanstack/react-query';
import AtletaService from '@/services/atleta';

const postAtleta = async (atleta: { nomeCompleto: string; dataNascimento: string; }) => {
    return await AtletaService.createAtleta(atleta);
}

export function useAtletaMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postAtleta,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['atletas'] });
        },
        onError: (error) => {
            console.error("Erro ao criar atleta:", error);
        }
    });

    return mutate;
}