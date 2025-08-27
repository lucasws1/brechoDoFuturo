import prisma from "../config/prisma";

export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface StoredToken {
  id: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Salva ou atualiza os tokens do Melhor Envio no banco
 */
export async function saveTokens(tokenData: TokenData): Promise<StoredToken> {
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

  // Como só teremos um registro de token, sempre atualizamos o primeiro ou criamos novo
  const existingToken = await prisma.melhorEnvioToken.findFirst();

  if (existingToken) {
    return await prisma.melhorEnvioToken.update({
      where: { id: existingToken.id },
      data: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || existingToken.refreshToken, // Mantém o refresh token anterior se não vier um novo
        expiresAt,
      },
    });
  } else {
    return await prisma.melhorEnvioToken.create({
      data: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || "",
        expiresAt,
      },
    });
  }
}

/**
 * Recupera os tokens armazenados no banco
 */
export async function getStoredTokens(): Promise<StoredToken | null> {
  return await prisma.melhorEnvioToken.findFirst();
}

/**
 * Verifica se o token atual ainda é válido (com margem de 5 segundos)
 */
export function isTokenValid(token: StoredToken): boolean {
  return new Date() < new Date(token.expiresAt.getTime() - 5000);
}

/**
 * Remove os tokens do banco (útil para logout/reauth)
 */
export async function clearTokens(): Promise<void> {
  await prisma.melhorEnvioToken.deleteMany();
}
