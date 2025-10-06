import { z } from "zod";
import { Request, Response } from "express";
import { Address } from "../../generated/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { getUser, addAddressToUserService } from "../services/address.service";

const AddressSchema = z.object({
  label: z.string().min(1, "Label é obrigatório"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  district: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  cep: z
    .string()
    .min(8, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido"),
  isDefault: z.boolean().optional(),
});

type AddressForm = z.infer<typeof AddressSchema>;

export const createAddress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id as string;

  try {
    const address = AddressSchema.parse(req.body);
    const newAddress = await addAddressToUserService(
      userId,
      address as Omit<Address, "id">
    );

    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { message: (error as Error).message || "Erro ao criar endereço" },
    });
    return;
  }
};

export const listAddresses = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const user = await getUser(userId as string);

  if (!user) {
    res.status(404).json({
      success: false,
      error: { message: "Usuário não encontrado" },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: user.address,
  });
};
