import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Usuario } from "@prisma/client";
import * as authService from "./auth.service";
import { SignUpDTO, LoginDTO } from "./auth.types";
// import { DefaultError } from "../error/errors"; // Importe seu error handler

// Função 'DefaultError' placeholder (substitua pela sua)
const DefaultError = (res: Response, err: any) => {
  console.error(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Erro interno do servidor." });
};

/**
 * "Sanitiza" o objeto do usuário, removendo campos sensíveis (senha)
 * antes de enviá-lo como resposta ao cliente.
 */
const sanitizeUser = (user: Usuario) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { senhaHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

/* 1. Cadastro (Signup) */
export const signup = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Cria uma nova conta de treinador no sistema.'
   #swagger.tags = ['Autenticação']
   #swagger.parameters['body'] = {
       in: 'body',
       schema: { $ref: '#/definitions/SignUpDTO' }
   }
   #swagger.responses[201] = { description: 'Usuário criado com sucesso.', schema: { $ref: '#/definitions/User' } }
   #swagger.responses[400] = { description: 'Erro de validação.', schema: { $ref: '#/definitions/ErrorValidation' } }
  */
  const data = req.body as SignUpDTO;

  try {
    // Validação: Checa se o e-mail já existe
    const existingUser = await authService.getUsuarioByEmail(data.email);
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        fieldErrors: {
          email: "E-mail já cadastrado.",
        },
      });
    }

    // Cria o usuário (service faz o hash da senha)
    const newUser = await authService.createUsuario(data);

    // Retorna o usuário criado (sem a senha)
    return res.status(StatusCodes.CREATED).json(sanitizeUser(newUser));
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 2. Login */
export const login = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Autentica um treinador e inicia uma sessão.'
   #swagger.tags = ['Autenticação']
   #swagger.parameters['body'] = {
       in: 'body',
       schema: { $ref: '#/definitions/LoginDTO' }
   }
   // (AJUSTE SWAGGER: O 'schema' agora retorna 'user' e 'token')
   #swagger.responses[200] = { 
       description: 'Login bem-sucedido.', 
       schema: { 
         user: { $ref: '#/definitions/User' }, 
         token: "ajf...sess...id...234" 
       } 
     }
   #swagger.responses[401] = { description: 'Credenciais inválidas.', schema: { $ref: '#/definitions/ErrorAuth' } }
  */
  const data = req.body as LoginDTO;

  try {
    // Verifica as credenciais
    const user = await authService.checkCredentials(data);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "E-mail ou senha inválidos.",
      });
    }

    // Sucesso: Armazena o ID do usuário na sessão (Redis)
    req.session.uid = user.id;

    // (AJUSTE REACT NATIVE)
    // Retornamos o usuário E o ID da sessão (como 'token').
    // O React (Web) continuará usando o cookie que foi enviado.
    // O React Native usará o 'token' (req.session.id) para o header.
    return res.status(StatusCodes.OK).json({
      user: sanitizeUser(user),
      token: req.session.id
    });

  } catch (err) {
    DefaultError(res, err);
  }
};

/* 3. Logout */
export const logout = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Encerra a sessão do treinador logado.'
   #swagger.tags = ['Autenticação']
   // (AJUSTE SWAGGER: Aceita 'session' (cookie) ou 'bearer' (header))
   #swagger.security = [{ "session": [] }, { "bearer": [] }] 
   #swagger.responses[200] = { description: 'Logout bem-sucedido.' }
   #swagger.responses[401] = { description: 'Não autenticado.' }
  */
  try {
    // O 'isAuth' (que vamos ajustar) garante que a sessão
    // foi carregada no 'req.session',
    // vindo do cookie ou do header 'bearer'.
    if (!req.session || !req.session.uid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Não autenticado" });
    }

    // Destrói a sessão no Redis
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Erro ao encerrar sessão" });
      }

      // Limpa o cookie no navegador do cliente (para o React Web)
      res.clearCookie("connect.sid"); 
      return res
        .status(StatusCodes.OK)
        .json({ message: "Logout realizado com sucesso" });
    });
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 4. Me (Buscar dados do usuário logado) */
export const me = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Retorna os dados do treinador atualmente logado.'
   #swagger.tags = ['Autenticação']
   // (AJUSTE SWAGGER: Aceita 'session' (cookie) ou 'bearer' (header))
   #swagger.security = [{ "session": [] }, { "bearer": [] }]
   #swagger.responses[200] = { description: 'Dados do usuário.', schema: { $ref: '#/definitions/User' } }
   #swagger.responses[401] = { description: 'Não autenticado.' }
   #swagger.responses[404] = { description: 'Usuário da sessão não encontrado.' }
  */
  try {
    // O middleware isAuth (que vamos ajustar) garante que
    // req.session.uid exista.
    const userId = req.session.uid!;

    const user = await authService.getUsuarioById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Usuário não encontrado" });
    }

    return res.status(StatusCodes.OK).json(sanitizeUser(user));
  } catch (err) {
    DefaultError(res, err);
  }
};