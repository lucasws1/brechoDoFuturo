import jwt from "jsonwebtoken";
import { UserType } from "../../generated/prisma";

export interface TokenPayload {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

// Função para obter os secrets de forma lazy
function getSecrets() {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET e REFRESH_TOKEN_SECRET devem estar definidos no arquivo .env"
    );
  }

  return {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
  };
}

export function generateAccessToken(payload: TokenPayload): string {
  const { ACCESS_TOKEN_SECRET } = getSecrets();
  // return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
  //   expiresIn: "1h",
  // });
  return jwt.sign(payload, ACCESS_TOKEN_SECRET);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const { REFRESH_TOKEN_SECRET } = getSecrets();
  // return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  return jwt.sign(payload, REFRESH_TOKEN_SECRET);
}

export function verifyAccessToken(token: string): TokenPayload {
  const { ACCESS_TOKEN_SECRET } = getSecrets();
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const { REFRESH_TOKEN_SECRET } = getSecrets();
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}
