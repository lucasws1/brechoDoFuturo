import jwt from "jsonwebtoken";
import { UserType } from "../../generated/prisma";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface TokenPayload {
  id: string;
  email: string;
  type: UserType;
}

// export const generateAuthToken = (payload: TokenPayload): string => {
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES_IN,
//     algorithm: "HS256",
//   } as jwt.SignOptions);
// };

// export const verifyToken = (token: string): TokenPayload => {
//   return jwt.verify(token, JWT_SECRET) as TokenPayload;
// };

// Versao nova - ChatGPT

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}
