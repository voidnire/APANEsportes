import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware para verificar se o usuário está autenticado.
 * Ele checa se 'req.session.uid' existe (definido no login).
 */
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.uid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Não autenticado" });
  }
  // Se estiver autenticado, continua para o próximo handler (o controller)
  next();
};