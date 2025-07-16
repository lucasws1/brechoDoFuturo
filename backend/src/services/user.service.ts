import { PrismaClient, UserType, User } from '../../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  type?: UserType;
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

interface UpdateUserData {
  name?: string;
  email?: string;
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

interface UserFilters {
  search?: string;
  type?: UserType;
  page?: number;
  limit?: number;
}

// Validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Criar usuário
export const createUser = async (data: CreateUserData) => {
  // Validações básicas
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Nome é obrigatório');
  }

  if (!data.email || !isValidEmail(data.email)) {
    throw new Error('Email válido é obrigatório');
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
  }

  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email já está em uso');
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
};

// Autenticar usuário
export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Credenciais inválidas');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Listar usuários
export const getUsers = async (filters: UserFilters = {}) => {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
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
      orderBy: { createdAt: 'desc' },
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
};

// Buscar usuário por ID
export const getUserById = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
) => {
  // Usuários só podem ver seu próprio perfil, exceto admins
  if (!isAdmin && id !== userId) {
    throw new Error('Você só pode visualizar seu próprio perfil');
  }

  const user = await prisma.user.findUnique({
    where: { id },
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
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
};

// Atualizar usuário
export const updateUser = async (
  id: string,
  data: UpdateUserData,
  userId: string,
  isAdmin: boolean = false
) => {
  // Usuários só podem atualizar seu próprio perfil, exceto admins
  if (!isAdmin && id !== userId) {
    throw new Error('Você só pode atualizar seu próprio perfil');
  }

  // Verificar se usuário existe
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Validações
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Email inválido');
  }

  // Verificar se o novo email já está em uso por outro usuário
  if (data.email && data.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// Deletar usuário
export const deleteUser = async (
  id: string,
  userId: string,
  isAdmin: boolean = false
): Promise<void> => {
  // Usuários só podem deletar sua própria conta, exceto admins
  if (!isAdmin && id !== userId) {
    throw new Error('Você só pode excluir sua própria conta');
  }

  // Verificar se usuário existe
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, type: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Impedir exclusão de contas admin por não-admins
  if (user.type === UserType.Admin && !isAdmin) {
    throw new Error('Não é possível excluir contas de administrador');
  }

  await prisma.user.delete({
    where: { id },
  });
};

// Alterar função do usuário
export const changeUserRole = async (
  id: string,
  newRole: UserType,
  adminId: string,
  isAdmin: boolean = false
) => {
  // Apenas admins podem alterar funções
  if (!isAdmin) {
    throw new Error('Apenas administradores podem alterar funções de usuário');
  }

  // Impedir alteração da própria função
  if (id === adminId) {
    throw new Error('Você não pode alterar sua própria função');
  }

  // Verificar se usuário existe
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Atualizar tipo do usuário
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { type: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// Buscar pedidos do usuário
export const getUserOrders = async (
  userId: string,
  filters: { page?: number; limit?: number; status?: string } = {},
  requesterId: string,
  isAdmin: boolean = false
) => {
  // Verificar permissões
  if (!isAdmin && userId !== requesterId) {
    throw new Error('Você só pode visualizar seus próprios pedidos');
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
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
      orderBy: { createdAt: 'desc' },
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
};
