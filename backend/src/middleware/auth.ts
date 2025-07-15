import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
// import { verifyToken, extractTokenFromHeader } from '@/utils/jwt';
// import prisma from '@/config/database';

/**
 * Middleware de autenticação
 * Verifica se o usuário está autenticado
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implementar após corrigir JWT
    // const token = extractTokenFromHeader(req.headers.authorization);

    // if (!token) {
    //   res.status(401).json({
    //     success: false,
    //     error: { message: 'Token de acesso necessário' }
    //   });
    //   return;
    // }

    // const decoded = verifyToken(token);

    // const user = await prisma.user.findUnique({
    //   where: { id: decoded.userId }
    // });

    // if (!user) {
    //   res.status(401).json({
    //     success: false,
    //     error: { message: 'Usuário não encontrado' }
    //   });
    //   return;
    // }

    // req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: "Token inválido ou expirado" },
    });
  }
};

/**
 * Middleware para verificar se o usuário é admin
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { message: "Usuário não autenticado" },
    });
    return;
  }

  if (req.user.type !== "Admin") {
    res.status(403).json({
      success: false,
      error: { message: "Acesso negado. Apenas administradores." },
    });
    return;
  }

  next();
};

/**
 * Middleware para verificar se o usuário é customer
 */
export const requireCustomer = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { message: "Usuário não autenticado" },
    });
    return;
  }

  if (req.user.type !== "Customer") {
    res.status(403).json({
      success: false,
      error: { message: "Acesso negado. Apenas clientes." },
    });
    return;
  }

  next();
};
