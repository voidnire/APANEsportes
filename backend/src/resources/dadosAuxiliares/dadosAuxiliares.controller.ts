import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as dadosService from "./dadosAuxiliares.service";

// import { DefaultError } from "../error/errors"; // Importe seu error handler
// Função 'DefaultError' placeholder (substitua pela sua)
const DefaultError = (res: Response, err: any) => {
  console.error(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Erro interno do servidor." });
};

/* 1. Listar todas as Classificações (Tela 4/5) */
export const getClassificacoes = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Lista todas as Classificações Paralímpicas (do seed).'
   #swagger.tags = ['Dados Auxiliares']
   #swagger.security = [{ "session": [] }]
   #swagger.responses[200] = { description: 'Lista de classificações (ex: T11, F40).' }
  */
  try {
    const classificacoes = await dadosService.getClassificacoes();
    return res.status(StatusCodes.OK).json(classificacoes);
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 2. Listar todas as Modalidades (Tela 2) */
export const getModalidades = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Lista todas as Modalidades esportivas (do seed).'
   #swagger.tags = ['Dados Auxiliares']
   #swagger.security = [{ "session": [] }]
   #swagger.responses[200] = { description: 'Lista de modalidades (ex: 100m Rasos, Salto em Distância).' }
  */
  try {
    const modalidades = await dadosService.getModalidades();
    return res.status(StatusCodes.OK).json(modalidades);
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 3. Listar Métricas por Modalidade (Tela 2) */
export const getMetricasByModalidade = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Lista quais métricas (Tempo, Distância) uma Modalidade exige.'
   #swagger.description = 'Endpoint "mágico" da Tela 2. Retorna os campos que o frontend deve renderizar.'
   #swagger.tags = ['Dados Auxiliares']
   #swagger.security = [{ "session": [] }]
   #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID da Modalidade' }
   #swagger.responses[200] = { description: 'Lista de tipos de métrica (ex: [ { nome: "Distância" }, { nome: "Velocidade do Vento" } ]).' }
   #swagger.responses[404] = { description: 'Modalidade não encontrada.' }
  */
  try {
    const { id } = req.params; // Já validado pelo Joi (schema)
    const metricas = await dadosService.getMetricasByModalidade(id);

    // O Service retorna 'null' se não encontrar a modalidade
    if (metricas === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Modalidade não encontrada." });
    }

    return res.status(StatusCodes.OK).json(metricas);
  } catch (err) {
    DefaultError(res, err);
  }
};