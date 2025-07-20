import { Request, Response } from "express";
import { createUser, authenticateUser } from "../services/user.service";
import { UserType } from "../../generated/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth";
import prisma from "../config/prisma";

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
        error: { message: "Nome, email e senha são obrigatórios" },
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
        message: (error as Error).message || "Erro ao registrar usuário",
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
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { message: "Email e senha são obrigatórios" },
      });
      return;
    }

    // Autentica o usuário
    const user = await authenticateUser(email, password);

    // Gera o token JWT - Versao antiga
    // const token = generateAccessToken({
    //   id: user.id,
    //   email: user.email,
    //   type: user.type,
    // });

    // Versao nova - ChatGPT
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.json({
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      },
      error: null,
      message: "Login realizado com sucesso",
      success: true,
    });

    // Versao antiga
    // res.status(200).json({
    //   success: true,
    //   data: {
    //     message: "Login realizado com sucesso",
    //     user,
    //     token,
    //   },
    // });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    const status = (error as Error).message.includes("Credenciais") ? 401 : 400;

    res.status(status).json({
      success: false,
      error: {
        message: (error as Error).message || "Erro ao fazer login",
      },
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
      error: { message: "Erro ao obter perfil do usuário" },
    });
  }
};

/**
 * Faz logout do usuário - Inútil, implementar no frontend
 */
export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    // Em um sistema JWT stateless, o logout é feito pelo cliente removendo o token
    res.status(200).json({
      success: true,
      data: { message: "Logout realizado com sucesso" },
    });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro ao processar logout" },
    });
  }
};

/**
 * Refreshes the access token using the refresh token
 */
export const refreshToken = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).json({
      data: null,
      error: { message: "Refresh token não fornecido" },
      message: "",
    });
  }

  // Opcional: busca user pelo refreshToken para garantir que está no banco
  const user = await prisma.user.findFirst({ where: { refreshToken } });
  if (!user) {
    res.status(401).json({
      data: null,
      error: { message: "Refresh token inválido" },
      message: "",
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken) as {
      id: string;
      name: string;
      email: string;
    };
    const newAccessToken = generateAccessToken({
      id: payload.id,
      name: payload.name, // Adicionado
      email: payload.email,
      type: user?.type as UserType,
    });
    // Opcional: gerar novo refresh token ("rotation")
    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      name: payload.name, // Adicionado
      email: payload.email,
      type: user?.type as UserType,
    });

    // Atualiza refresh token no banco
    await prisma.user.update({
      where: { id: user?.id },
      data: { refreshToken: newRefreshToken },
    });

    res.json({
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      error: null,
      message: "Token renovado",
    });
  } catch (e) {
    res.status(401).json({
      data: null,
      error: { message: "Refresh token inválido ou expirado" },
      message: "",
    });
  }
};
