import { useQuery } from "@tanstack/react-query";
import AtletaService from "@/services/atleta";
import { AtletaResumido } from "@/models/atletas";


export function useAtletas(){
    const query = useQuery({
        queryFn: AtletaService.getAtletas,
        queryKey: ['atletas'],
    });

    console.log("useAtletas data:", query.data);

    return {...query, data:query.data || []};
}
