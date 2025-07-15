import { Request, Response } from "express";
import {
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  AuthenticatedRequest,
} from "../types";
import { AuthService } from "../services/AuthService";

/**
 * Registra um novo usuário
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address }: RegisterRequest = req.body;

    // Validação básica
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: { message: "Nome, email e senha são obrigatórios" },
      } as ApiResponse);
      return;
    }

    const result = await AuthService.register({
      name,
      email,
      password,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      data: {
        message: "Usuário registrado com sucesso",
        user: result.user,
        token: result.token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Faz login do usuário
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validação básica
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { message: "Email e senha são obrigatórios" },
      } as ApiResponse);
      return;
    }

    const result = await AuthService.login({ email, password });

    res.status(200).json({
      success: true,
      data: {
        message: "Login realizado com sucesso",
        user: result.user,
        token: result.token,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    if (error instanceof Error) {
      const statusCode = error.message.includes("incorretos") ? 401 : 400;
      res.status(statusCode).json({
        success: false,
        error: { message: error.message },
      } as ApiResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
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
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: { user: req.user },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};

/**
 * Faz logout do usuário
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
      await AuthService.logout(token);
    }

    res.status(200).json({
      success: true,
      data: { message: "Logout realizado com sucesso" },
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    res.status(500).json({
      success: false,
      error: { message: "Erro interno do servidor" },
    } as ApiResponse);
  }
};
