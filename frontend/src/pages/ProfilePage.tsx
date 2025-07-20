import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, loading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
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
    return <div className="container mx-auto py-8 text-red-500">Usuário não encontrado.</div>;
  }

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await api.put(`/users/me`, values);
      toast.success("Perfil atualizado com sucesso!");
      refreshUser(); // Chama a função para atualizar o usuário no contexto
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao atualizar perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/users/${user.id}`); // Ou `/users/me` se o backend permitir
      logout();
      toast.success("Conta deletada com sucesso!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Erro ao deletar conta.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="type">Tipo de Usuário</Label>
              <Input id="type" value={user.type} readOnly />
            </div>
            <Button type="submit" className="w-full">Salvar Alterações</Button>
          </form>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full mt-4">Deletar Conta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tem certeza que deseja deletar sua conta?</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Isso removerá permanentemente sua conta e seus dados de nossos servidores.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>Deletar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
