import {
  login as loginService,
  rotateRefreshToken,
} from "@/services/auth.service";
import { Response } from "express";
import { UserType } from "../../generated/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { createUser } from "../services/user.service";
import { generateAccessToken } from "../utils/jwt";
import { logout as logoutService } from "../services/auth.service";
import { PrismaClient } from "../../generated/prisma";
import { ref } from "process";

const prisma = new PrismaClient();

// Constantes
const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dias
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Tipos para responses
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Funções auxiliares para configuração de cookies
const getCookieOptions = (includeMaxAge = false) => {
  const baseOptions = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    ...(IS_PRODUCTION && { sameSite: "strict" as const }),
  };

  return includeMaxAge
    ? { ...baseOptions, maxAge: REFRESH_TOKEN_MAX_AGE }
    : baseOptions;
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, getCookieOptions(true));
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getCookieOptions(false));
};

/**
 * Registra um novo usuário
 */
export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, type = UserType.Customer } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: {
          message: "Nome, email e senha são obrigatórios - authController",
        },
      });
      return;
    }

    // Cria o usuário
    const user = await createUser({
      name,
      email,
      password,
      type,
    });

    // Gera o token JWT
    const token = generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    });

    res.status(201).json({
      success: true,
      data: {
        message: "Usuário registrado com sucesso",
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    const status = (error as Error).message.includes("já está em uso")
      ? 409
      : 400;

    res.status(status).json({
      success: false,
      error: {
        message:
          (error as Error).message ||
          "Erro ao registrar usuário - authController",
      },
    });
  }
};

/**
 * Faz login do usuário
 */
export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken, message } = await loginService(
      email,
      password
    );
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(401).json({
      success: false,
      error: { message: "Credenciais inválidas - authController" },
    });
  }
};

/**
 * Obtém o perfil do usuário logado
 */
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: "Usuário não autenticado" },
      });
      return;
    }

    // O usuário já está autenticado pelo middleware de autenticação
    res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro ao obter perfil do usuário - authController" },
    });
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: { message: "Refresh token não fornecido - authController" },
      });
      return;
    }

    await logoutService(refreshToken);
    clearRefreshTokenCookie(res);

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro ao processar logout - authController" },
    });
  }
};

/**
 * Refreshes the access token using the refresh token
 */
export const refreshToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: { message: "Refresh token não fornecido - authController" },
    });
    return;
  }

  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) {
    res.status(401).json({
      success: false,
      error: { message: "Refresh token inválido - authController" },
    });
    return;
  }

  try {
    const result = await rotateRefreshToken(refreshToken);
    if (!result || !result.accessToken || !result.refreshToken) {
      clearRefreshTokenCookie(res);
      res.status(401).json({
        success: false,
        error: {
          message: "Refresh token inválido ou expirado 1 - authController",
        },
      });
      return;
    }

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      data: { accessToken: result.accessToken },
      error: null,
      message: "Token renovado",
    });
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    clearRefreshTokenCookie(res);
    res.status(401).json({
      success: false,
      error: {
        message: "Refresh token inválido ou expirado 2 - authController",
      },
    });
  }
};
