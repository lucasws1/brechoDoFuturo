import { PrismaClient, Address } from "../../generated/prisma";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      address: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
};

export const addAddressToUserService = async (
  userId: string,
  address: Omit<Address, "id">
) => {
  const newAddress = await prisma.user.update({
    where: { id: userId },
    data: {
      address: { push: { ...address, id: uuidv4() } as Address },
    },
  });

  if (!newAddress) {
    throw new Error("Erro ao criar endereço");
  }

  return newAddress;
};
