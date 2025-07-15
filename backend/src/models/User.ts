import {
  PrismaClient,
  User as PrismaUser,
  UserType,
} from "../../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  type?: UserType;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export class User {
  // Criar usuário
  static async create(
    data: CreateUserData
  ): Promise<Omit<PrismaUser, "password">> {
    // Validações básicas
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Nome é obrigatório");
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error("Email válido é obrigatório");
    }

    if (!data.password || data.password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        type: data.type || UserType.Customer,
      },
    });

    // Retornar sem a senha
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Buscar usuário por email (para login)
  static async findByEmail(email: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Buscar usuário por ID (sem senha)
  static async findById(
    id: string
  ): Promise<Omit<PrismaUser, "password"> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Listar usuários (admin)
  static async findMany(filters?: {
    search?: string;
    type?: UserType;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          type: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          // Não incluir senha
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Atualizar usuário
  static async update(
    id: string,
    data: UpdateUserData
  ): Promise<Omit<PrismaUser, "password">> {
    // Verificar se usuário existe
    const user = await this.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Validações
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error("Email inválido");
    }

    // Verificar se o novo email já está em uso por outro usuário
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("Email já está em uso");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Deletar usuário
  static async delete(id: string): Promise<void> {
    // Verificar se usuário existe
    const user = await this.findById(id);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await prisma.user.delete({
      where: { id },
    });
  }

  // Verificar senha
  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Validar email
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Buscar pedidos do usuário
  static async getUserOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId: userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: { customerId: userId } }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
