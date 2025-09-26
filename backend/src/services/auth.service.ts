import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import { compare } from "bcryptjs";
import { PrismaClient, UserType } from "../../generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Credenciais inválidas - auth.service");
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Senha inválida - auth.service");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    type: user.type,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const accessTokenDecoded = jwt.decode(accessToken) as { exp?: number } | null;
  const refreshTokenDecoded = jwt.decode(refreshToken) as {
    exp?: number;
  } | null;
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    success: true,
    message: "Login realizado com sucesso",
    accessToken,
    refreshToken,
    accessTokenExpiresAt: accessTokenDecoded?.exp ?? null,
    refreshTokenExpiresAt: refreshTokenDecoded?.exp ?? null,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    },
  };
}

export async function rotateRefreshToken(refreshTokenFromCookie: string) {
  const payload = verifyRefreshToken(refreshTokenFromCookie) as {
    id: string;
    name: string;
    email: string;
    type: UserType;
  };

  const user = await prisma.user.findFirst({
    where: { refreshToken: refreshTokenFromCookie },
  });
  if (!user) {
    console.log("Refresh token inválido - auth.service");
    return;
  }

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  const newAccessDecoded = jwt.decode(newAccessToken) as {
    exp?: number;
  } | null;
  const newRefreshDecoded = jwt.decode(newRefreshToken) as {
    exp?: number;
  } | null;

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return {
    success: true,
    message: "Refresh token atualizado com sucesso",
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenExpiresAt: newAccessDecoded?.exp ?? null,
    refreshTokenExpiresAt: newRefreshDecoded?.exp ?? null,
  };
}

export async function logout(refreshTokenFromCookie?: string) {
  if (!refreshTokenFromCookie) {
    console.log("Refresh token não fornecido - auth.service");
    return;
  }

  const user = await prisma.user.findFirst({
    where: { refreshToken: refreshTokenFromCookie },
  });

  if (!user) {
    console.log("Refresh token inválido - auth.service");
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null },
  });

  return {
    success: true,
    message: "Logout realizado com sucesso",
  };
}
