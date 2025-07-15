import { User, CreateUserData } from "../models/User";
import { generateToken, verifyToken } from "../utils/jwt";
import { UserType } from "../../generated/prisma";

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<any, "password">;
  token: string;
}

export class AuthService {
  // Registro de usuário
  static async register(data: CreateUserData): Promise<AuthResponse> {
    // Criar usuário
    const user = await User.create(data);

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      type: user.type,
    } as any);

    return {
      user,
      token,
    };
  }

  // Login
  static async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Validações básicas
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    // Buscar usuário por email (com senha)
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    // Verificar senha
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Email ou senha incorretos");
    }

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      type: user.type,
    } as any);

    // Retornar sem a senha
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  // Verificar token e retornar dados do usuário
  static async verifyAuth(
    token: string
  ): Promise<Omit<any, "password"> | null> {
    try {
      // Verificar token
      const decoded = verifyToken(token);

      if (!decoded || !decoded.userId) {
        return null;
      }

      // Buscar usuário atual
      const user = await User.findById(decoded.userId);

      return user;
    } catch (error) {
      return null;
    }
  }

  // Verificar se usuário é admin
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await User.findById(userId);
    return user?.type === UserType.Admin;
  }

  // Verificar se usuário tem permissão para acessar recurso
  static async hasPermission(
    userId: string,
    resourceOwnerId?: string,
    requireAdmin = false
  ): Promise<boolean> {
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    // Se requer admin, verificar se é admin
    if (requireAdmin) {
      return user.type === UserType.Admin;
    }

    // Se é admin, sempre tem permissão
    if (user.type === UserType.Admin) {
      return true;
    }

    // Se não especificou dono do recurso, apenas logado é suficiente
    if (!resourceOwnerId) {
      return true;
    }

    // Verificar se é o dono do recurso
    return user.id === resourceOwnerId;
  }

  // Refresh token (opcional para implementação futura)
  static async refreshToken(oldToken: string): Promise<string> {
    const decoded = verifyToken(oldToken);

    if (!decoded || !decoded.userId) {
      throw new Error("Token inválido");
    }

    // Verificar se usuário ainda existe
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Gerar novo token
    return generateToken({
      id: user.id,
      email: user.email,
      type: user.type,
    } as any);
  }

  // Logout (invalidar token - implementação futura com blacklist)
  static async logout(token: string): Promise<void> {
    // Para implementação futura: adicionar token à blacklist
    // Por enquanto, o logout será feito no frontend removendo o token
    console.log("Logout realizado para token:", token.substring(0, 20) + "...");
  }
}
