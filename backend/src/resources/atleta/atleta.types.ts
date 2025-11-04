import { Atleta } from "@prisma/client";

/**
 * DTO para CRIAR um novo atleta (Tela 4).
 * O 'usuarioId' virá da sessão, não do body.
 */
export type CreateAtletaDTO = Pick<Atleta, "nomeCompleto" | "dataNascimento">;

/**
 * DTO para ATUALIZAR um atleta (Tela 5).
 * Todos os campos são opcionais.
 */
export type UpdateAtletaDTO = Partial<CreateAtletaDTO>;

/**
 * DTO para ASSOCIAR uma classificação a um atleta
 * (Usado na Tela 4 ou 5).
 */
export type AssociateClassificacaoDTO = {
  classificacaoId: string;
};