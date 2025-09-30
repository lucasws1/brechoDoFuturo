import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UserType } from "../../generated/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    type: UserType;
  };
  sessionId?: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const sessionId = req.cookies.cart_sid;

  // Se houver token, faz a autenticação do usuário
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);

      req.user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        type: decoded.type as UserType,
      };
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }
  }
  if (sessionId) {
    req.sessionId = sessionId;
    return next();
  }

  return next();
};

export const authorize = (...allowedTypes: UserType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Autenticação requerida" });
    }

    if (!allowedTypes.includes(req.user.type)) {
      return res.status(403).json({ message: "Não autorizado" });
    }

    return next();
  };
};
