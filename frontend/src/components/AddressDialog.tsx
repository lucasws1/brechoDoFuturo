import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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

export function AddressDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<AddressForm>({ resolver: zodResolver(AddressSchema) });

  // auto preencher cep
  async function fetchCep(cep: string) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    // chamar backend para ViaCEP (ou direto se permitido)
    const response = await api.get(`/viacep/${clean}`);
    const data = response.data;
    if (data.success) {
      setValue("street", data.data.logradouro);
      setValue("number", data.data.numero);
      setValue("complement", data.data.complemento);
      setValue("district", data.data.bairro);
      setValue("city", data.data.cidade);
      setValue("state", data.data.estado);
      setValue("cep", data.data.cep);
    } else {
      toast.error("CEP não encontrado");
    }
  }

  const onSubmit = async (data: AddressForm) => {
    console.log(data);
    try {
      await api.post("/address", data);
      toast.success("Endereço criado com sucesso!");
      onCreated();
      onClose();
      return;
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || "Erro ao criar endereço",
      );
      reset();
      return;
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Adicionar Endereço</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" {...register("label")} />
          {errors.label && (
            <p className="text-destructive mt-1 text-sm">
              {errors.label.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="street">Endereço</Label>
          <Input id="street" {...register("street")} />
          {errors.street && (
            <p className="text-destructive mt-1 text-sm">
              {errors.street.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="number">Número</Label>
          <Input id="number" {...register("number")} />
          {errors.number && (
            <p className="text-destructive mt-1 text-sm">
              {errors.number.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" {...register("complement")} />
          {errors.complement && (
            <p className="text-destructive mt-1 text-sm">
              {errors.complement.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="district">Bairro</Label>
          <Input id="district" {...register("district")} />
          {errors.district && (
            <p className="text-destructive mt-1 text-sm">
              {errors.district.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...register("city")} />
          {errors.city && (
            <p className="text-destructive mt-1 text-sm">
              {errors.city.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="state">Estado</Label>
          <Input id="state" {...register("state")} />
          {errors.state && (
            <p className="text-destructive mt-1 text-sm">
              {errors.state.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" {...register("cep")} />
          {errors.cep && (
            <p className="text-destructive mt-1 text-sm">
              {errors.cep.message}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Enviar
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
