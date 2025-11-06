import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Middleware para verificar se o usuário está autenticado.
 * Suporta dois métodos: Cookie (Web) e Bearer Token (Mobile).
 */
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  
  // 1. Caminho Padrão (Web / Insomnia / Cookies)
  // Se 'uid' existe na sessão (carregada pelo 'express-session'),
  // o usuário está logado.
  if (req.session && req.session.uid) {
    // (A linha 'req.usuarioId = ...' foi removida, era desnecessária)
    return next();
  }

  // 2. Caminho Alternativo (React Native / Header Authorization)
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const sessionId = authHeader.split(' ')[1];

    if (!sessionId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Token (Session ID) mal formatado." });
    }

    // 3. Busca Manualmente a Sessão no Redis (sessionStore)
    req.sessionStore.get(sessionId, (err, sessionData) => { 
      
      if (err) {
        console.error("Erro ao buscar sessão no Redis:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro no servidor de sessão." });
      }

      // Sessão não encontrada no Redis ou não tem o 'uid'
      if (!sessionData || !sessionData.uid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Sessão inválida ou expirada." });
      }

      // 4. SUCESSO! "Re-hidrata" a sessão no request.
      
      // (Esta é a correção do erro TS(2322) da última vez)
      // Define o ID da sessão no objeto Session (para .destroy() funcionar)
      req.session.id = sessionId; 
      
      // Copia os dados da sessão (uid) para o objeto Session
      // (O 'userTypeId' também está no seu index.ts, então copiamos)
      req.session.uid = sessionData.uid;
      req.session.userTypeId = sessionData.userTypeId;
      
      // (A linha 'req.usuarioId = ...' foi removida, era a causa do erro)
      
      return next();
    });
    
  } else {
    // 5. Se não tem nem cookie (caminho 1) e nem header (caminho 2)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Não autenticado." });
  }
};