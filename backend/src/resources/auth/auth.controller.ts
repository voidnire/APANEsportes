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
   #swagger.responses[400] = { description: 'E-mail já cadastrado.' }
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

    // (Opcional: Logar automaticamente o usuário após o cadastro)
    // req.session.uid = newUser.id;

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
   #swagger.responses[200] = { description: 'Login bem-sucedido.', schema: { $ref: '#/definitions/User' } }
   #swagger.responses[401] = { description: 'Credenciais inválidas.' }
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
    // (Opcional: você tinha userTypeId no seu exemplo, mas nosso schema não tem)
    // req.session.userTypeId = user.tipo; 

    return res.status(StatusCodes.OK).json(sanitizeUser(user));
  } catch (err) {
    DefaultError(res, err);
  }
};

/* 3. Logout */
export const logout = async (req: Request, res: Response) => {
  /*
   #swagger.summary = 'Encerra a sessão do treinador logado.'
   #swagger.tags = ['Autenticação']
   #swagger.security = [{ "session": [] }] 
   #swagger.responses[200] = { description: 'Logout bem-sucedido.' }
   #swagger.responses[401] = { description: 'Não autenticado.' }
  */
  try {
    // isAuth já garante que a sessão existe, mas checamos por segurança
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

      // Limpa o cookie no navegador do cliente
      // O nome 'connect.sid' é o padrão, ajuste se você mudou
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
   #swagger.security = [{ "session": [] }]
   #swagger.responses[200] = { description: 'Dados do usuário.', schema: { $ref: '#/definitions/User' } }
   #swagger.responses[401] = { description: 'Não autenticado.' }
   #swagger.responses[404] = { description: 'Usuário da sessão não encontrado.' }
  */
  try {
    // O middleware isAuth já rodou, então req.session.uid está disponível
    const userId = req.session.uid!;

    const user = await authService.getUsuarioById(userId);

    if (!user) {
      // Isso pode acontecer se o usuário foi deletado
      // mas a sessão ainda existe
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Usuário não encontrado" });
    }

    return res.status(StatusCodes.OK).json(sanitizeUser(user));
  } catch (err) {
    DefaultError(res, err);
  }
};