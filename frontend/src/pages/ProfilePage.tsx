import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import api from "../services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Trash2,
  Plus,
  Eye,
  Edit,
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

const addressSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  street: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP deve ter 8 dígitos"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;

// Mock data - Em um cenário real, isso viria da API
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 89.9,
    items: 2,
    trackingCode: "BR123456789BR",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 125.5,
    items: 3,
    trackingCode: "BR987654321BR",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 67.3,
    items: 1,
    trackingCode: null,
  },
];

const mockAddresses = [
  {
    id: "1",
    name: "Casa",
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    isDefault: true,
  },
  {
    id: "2",
    name: "Trabalho",
    street: "Av. Paulista",
    number: "1000",
    complement: "Sala 501",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    isDefault: false,
  },
];

const mockPaymentMethods = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "1234",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "Mastercard",
    last4: "5678",
    isDefault: false,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Entregue";
    case "shipped":
      return "Enviado";
    case "processing":
      return "Processando";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
};

const ProfilePage = () => {
  const { user, loading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  if (loading) {
    return <div className="container mx-auto py-8">Carregando perfil...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-red-500">
        Usuário não encontrado.
      </div>
    );
  }

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "profile";
  const [currentTab, setCurrentTab] = useState(initialTab);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await api.put(`/users/me`, values);
      toast.success("Perfil atualizado com sucesso!");
      refreshUser(); // Chama a função para atualizar o usuário no contexto
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || "Erro ao atualizar perfil.",
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/users/${user.id}`); // Ou `/users/me` se o backend permitir
      logout();
      toast.success("Conta deletada com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || "Erro ao deletar conta.",
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Minha Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={initialTab}
              className="w-full"
              onValueChange={setCurrentTab}
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Endereços
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Pagamento
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Configurações
                </TabsTrigger>
              </TabsList>

              {/* Aba de Perfil */}
              <TabsContent value="profile" className="space-y-4">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" {...form.register("name")} />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...form.register("email")} />
                    {form.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo de Usuário</Label>
                    <Input id="type" value={user.type} readOnly />
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar Alterações
                  </Button>
                </form>
              </TabsContent>

              {/* Aba de Pedidos */}
              <TabsContent value="orders" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Histórico de Pedidos
                  </h3>
                </div>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Pedido #{order.id}
                            </span>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString("pt-BR")} •{" "}
                            {order.items} {order.items === 1 ? "item" : "itens"}
                          </p>
                          {order.trackingCode && (
                            <p className="text-sm text-blue-600">
                              Código de rastreamento: {order.trackingCode}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {order.total.toFixed(2).replace(".", ",")}
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Eye className="mr-1 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Aba de Endereços */}
              <TabsContent value="addresses" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Meus Endereços</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Endereço
                  </Button>
                </div>
                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <Badge variant="secondary">Padrão</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}, {address.number}
                            {address.complement && `, ${address.complement}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.neighborhood}, {address.city} -{" "}
                            {address.state}
                          </p>
                          <p className="text-sm text-gray-600">
                            CEP: {address.zipCode}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Aba de Métodos de Pagamento */}
              <TabsContent value="payment" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Métodos de Pagamento
                  </h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Cartão
                  </Button>
                </div>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {method.brand}
                              </span>
                              {method.isDefault && (
                                <Badge variant="secondary">Padrão</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              •••• •••• •••• {method.last4}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Esta funcionalidade requer integração
                    com gateway de pagamento. No momento, apenas dados mockados
                    são exibidos.
                  </p>
                </Card>
              </TabsContent>

              {/* Aba de Configurações */}
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">
                      Configurações da Conta
                    </h3>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="mb-2 font-medium">Alterar Senha</h4>
                        <p className="mb-3 text-sm text-gray-600">
                          Para sua segurança, recomendamos alterar sua senha
                          regularmente.
                        </p>
                        <Button variant="outline">Alterar Senha</Button>
                      </Card>

                      <Card className="p-4">
                        <h4 className="mb-2 font-medium">Notificações</h4>
                        <p className="mb-3 text-sm text-gray-600">
                          Configure como deseja receber notificações sobre seus
                          pedidos.
                        </p>
                        <Button variant="outline">
                          Configurar Notificações
                        </Button>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-red-600">
                      Zona de Perigo
                    </h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar Conta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Tem certeza que deseja deletar sua conta?
                          </DialogTitle>
                          <DialogDescription>
                            Esta ação não pode ser desfeita. Isso removerá
                            permanentemente sua conta e seus dados de nossos
                            servidores.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                          >
                            Deletar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
