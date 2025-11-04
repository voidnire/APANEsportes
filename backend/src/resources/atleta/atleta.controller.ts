import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as atletaService from "./atleta.service";
import {
  CreateAtletaDTO,
  UpdateAtletaDTO,
  AssociateClassificacaoDTO,
} from "./atleta.types";

// import { DefaultError } from "../error/errors"; // Importe seu error handler
// Função 'DefaultError' placeholder (substitua pela sua)
const DefaultError = (res: Response, err: any) => {
  console.error(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Erro interno do servidor." });
};

// O model 'Atleta' é seguro, não contém senhas.
// A sanitização aqui é mais simples.
const sanitizeAtleta = (atleta: any) => {
  // 'classificacoes' vem como: [{ classificacao: { id, codigo, ... } }]
  // Vamos simplificar para: [{ id, codigo, ... }]
  if (atleta.classificacoes) {
    atleta.classificacoes = atleta.classificacoes.map(
      (c: any) => c.classificacao
    );
  }
  return atleta;
};

/* 1. Criar novo Atleta (Tela 4) */
export const createAtleta = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Cria um novo atleta para o treinador logado.'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/CreateAtletaDTO' } }
   #swagger.responses[201] = { description: 'Atleta criado.' }
  */
  try {
    const usuarioId = req.session.uid!; // Garantido pelo middleware isAuth
    const data = req.body as CreateAtletaDTO;

    const novoAtleta = await atletaService.createAtleta(data, usuarioId);
    return res.status(StatusCodes.CREATED).json(sanitizeAtleta(novoAtleta));
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 2. Listar Atletas (Tela 4) */
export const getAtletas = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Lista todos os atletas do treinador logado.'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
   #swagger.responses[200] = { description: 'Lista de atletas.' }
  */
  try {
    const usuarioId = req.session.uid!;
    const atletas = await atletaService.getAtletasByUsuario(usuarioId);
    return res.status(StatusCodes.OK).json(atletas.map(sanitizeAtleta));
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 3. Ver Atleta Específico (Tela 5) */
export const getAtleta = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Busca um atleta específico (e suas classificações).'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID do Atleta' }
   #swagger.responses[200] = { description: 'Dados do atleta.' }
   #swagger.responses[404] = { description: 'Atleta não encontrado ou não pertence ao usuário.' }
  */
  try {
    const usuarioId = req.session.uid!;
    const { id } = req.params; // Validado pelo 'validate'

    const atleta = await atletaService.getAtletaById(id, usuarioId);

    if (!atleta) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Atleta não encontrado ou não pertence a este treinador.",
      });
    }

    return res.status(StatusCodes.OK).json(sanitizeAtleta(atleta));
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 4. Atualizar Atleta (Tela 5) */
export const updateAtleta = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Atualiza dados de um atleta (nome, nascimento).'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
   #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/UpdateAtletaDTO' } }
   #swagger.responses[200] = { description: 'Atleta atualizado.' }
   #swagger.responses[404] = { description: 'Atleta não encontrado ou não pertence ao usuário.' }
  */
  try {
    const usuarioId = req.session.uid!;
    const { id } = req.params;
    const data = req.body as UpdateAtletaDTO;

    const atletaAtualizado = await atletaService.updateAtleta(id, data, usuarioId);

    if (!atletaAtualizado) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Atleta não encontrado ou não pertence a este treinador.",
      });
    }

    return res.status(StatusCodes.OK).json(sanitizeAtleta(atletaAtualizado));
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 5. Deletar Atleta (Tela 4) */
export const deleteAtleta = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Deleta um atleta e todo seu histórico (em cascata).'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' }
   #swagger.responses[204] = { description: 'Atleta deletado.' }
   #swagger.responses[404] = { description: 'Atleta não encontrado ou não pertence ao usuário.' }
  */
  try {
    const usuarioId = req.session.uid!;
    const { id } = req.params;

    const count = await atletaService.deleteAtleta(id, usuarioId);

    if (count === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Atleta não encontrado ou não pertence a este treinador.",
      });
    }

    // Sucesso, sem conteúdo
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 6. Associar Classificação (Tela 5) */
export const associateClassificacao = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Associa uma classificação paralímpica a um atleta.'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID do Atleta' }
   #swagger.parameters['body'] = { in: 'body', schema: { $ref: '#/definitions/AssociateClassificacaoDTO' } }
   #swagger.responses[201] = { description: 'Associação criada.' }
   #swagger.responses[404] = { description: 'Atleta ou Classificação não encontrados.' }
  */
  try {
    const usuarioId = req.session.uid!;
    const { id: atletaId } = req.params;
    const { classificacaoId } = req.body as AssociateClassificacaoDTO;

    await atletaService.associateClassificacao(
      atletaId,
      classificacaoId,
      usuarioId
    );

    return res.status(StatusCodes.CREATED).json({ message: "Associação criada." });
  } catch (err: any) {
    if (
      err.message.includes("Atleta não encontrado") ||
      err.message.includes("Classificação não encontrada")
    ) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
    }
    DefaultError(res, err);
  }
};

/* 7. Desassociar Classificação (Tela 5) */
export const disassociateClassificacao = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Remove uma classificação de um atleta.'
   #swagger.tags = ['Atletas']
   #swagger.security = [{ "session": [] }]
 Ambos os IDs são obrigatórios na URL
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID do Atleta' }
   #swagger.parameters['classificacaoId'] = { in: 'path', required: true, type: 'string', description: 'ID da Classificação' }
   #swagger.responses[204] = { description: 'Associação removida.' }
   #swagger.responses[404] = { description: 'Associação não encontrada ou não pertence ao usuário.' }
  */
  try {
    const usuarioId = req.session.uid!;
    const { id: atletaId, classificacaoId } = req.params;

    const count = await atletaService.disassociateClassificacao(
      atletaId,
      classificacaoId,
      usuarioId
    );
    
    if (count === 0) {
       return res.status(StatusCodes.NOT_FOUND).json({
        message: "Associação não encontrada ou não pertence a este treinador.",
      });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    DefaultError(res, err);
  }
};