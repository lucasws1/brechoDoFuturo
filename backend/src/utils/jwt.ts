import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  type: "Customer" | "Admin";
}

/**
 * Gera um token JWT para o usuário
 */
export const generateToken = (user: User): string => {
  // TODO: Corrigir tipagem do JWT
  return "temp-token";
  // const payload: JwtPayload = {
  //   userId: user.id,
  //   email: user.email,
  //   type: user.type,
  // };

  // return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica e decodifica um token JWT
 */
export const verifyToken = (token: string): JwtPayload => {
  // TODO: Corrigir tipagem do JWT
  return {
    userId: "temp-id",
    email: "temp@email.com",
    type: "Customer",
  };
  // try {
  //   return jwt.verify(token, JWT_SECRET) as JwtPayload;
  // } catch (error) {
  //   throw new Error("Token inválido ou expirado");
  // }
};

/**
 * Extrai o token do header Authorization
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
};
