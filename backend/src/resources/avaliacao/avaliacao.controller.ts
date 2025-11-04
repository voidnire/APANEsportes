import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as avaliacaoService from "./avaliacao.service";
import { CreateAvaliacaoDTO, GetAvaliacoesQueryDTO } from "./avaliacao.types";

// import { DefaultError } from "../error/errors"; // Importe seu error handler
// Função 'DefaultError' placeholder (substitua pela sua)
const DefaultError = (res: Response, err: any) => {
  console.error(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Erro interno do servidor." });
};

/* 1. Criar nova Avaliação (Tela 2) */
export const createAvaliacao = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Registra uma nova avaliação de desempenho para um atleta.'
   #swagger.tags = ['Avaliações']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/CreateAvaliacaoDTO' } }
   #swagger.responses[201] = { description: 'Avaliação registrada.' }
   #swagger.responses[403] = { description: 'Atleta não pertence ao treinador.' }
   #swagger.responses[400] = { description: 'Dados inválidos (validação Joi).' }
  */
  try {
    const usuarioId = req.session.uid!; // Garantido pelo 'isAuth'
    const data = req.body as CreateAvaliacaoDTO;

    const novaAvaliacao = await avaliacaoService.createAvaliacao(
      data,
      usuarioId
    );
    return res.status(StatusCodes.CREATED).json(novaAvaliacao);
  } catch (err: any) {
    // Tratamento de erro de segurança vindo do service
    if (err.message.includes("Atleta não encontrado")) {
      return res.status(StatusCodes.FORBIDDEN).json({
        fieldErrors: {
          atletaId: err.message, // Retorna no formato do seu validador
        },
      });
    }
    // Outros erros (ex: falha na transação)
    DefaultError(res, err);
  }
};

/* 2. Listar Avaliações (Telas 3 e 5) */
export const getAvaliacoes = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Lista o histórico de avaliações de um atleta, com filtros.'
   #swagger.tags = ['Avaliações']
   #swagger.security = [{ "session": [] }]
   #swagger.description = 'Busca o histórico de um atleta. O ?atletaId=uuid é obrigatório nos query params.'
   #swagger.parameters['atletaId'] = { in: 'query', required: true, type: 'string', description: 'ID do Atleta (obrigatório)' }
   #swagger.parameters['modalidadeId'] = { in: 'query', type: 'string', description: 'Filtrar por ID da modalidade' }
   #swagger.parameters['tipo'] = { in: 'query', enum: ['PRE_TREINO', 'POS_TREINO'], description: 'Filtrar por tipo de sessão' }
   #swagger.parameters['dataInicio'] = { in: 'query', type: 'string', format: 'date', description: 'Data inicial (YYYY-MM-DD)' }
   #swagger.parameters['dataFim'] = { in: 'query', type: 'string', format: 'date', description: 'Data final (YYYY-MM-DD)' }
   #swagger.responses[200] = { description: 'Histórico de avaliações.' }
   #swagger.responses[403] = { description: 'Atleta não pertence ao treinador.' }
  */
  try {
    const usuarioId = req.session.uid!;
    // 'req.query' já foi validado, convertido (datas) e limpo (stripUnknown) pelo Joi
    const queryParams = req.query as unknown as GetAvaliacoesQueryDTO;

    const avaliacoes = await avaliacaoService.getAvaliacoesByAtleta(
      queryParams,
      usuarioId
    );
    return res.status(StatusCodes.OK).json(avaliacoes);
  } catch (err: any) {
    // Tratamento de erro de segurança vindo do service
    if (err.message.includes("Atleta não encontrado")) {
      return res.status(StatusCodes.FORBIDDEN).json({
        fieldErrors: {
          atletaId: err.message, // Retorna no formato do seu validador
        },
      });
    }
    DefaultError(res, err);
  }
};