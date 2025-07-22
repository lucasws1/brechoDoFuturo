import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular envio por WhatsApp (você pode implementar integração real depois)
      const whatsappMessage = encodeURIComponent(
        `Olá! Vim pelo site do Brechó do Futuro.\n\n` +
          `Nome: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Assunto: ${formData.subject}\n` +
          `Mensagem: ${formData.message}`,
      );

      const whatsappNumber = "5511999999999"; // Substitua pelo número real
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

      window.open(whatsappUrl, "_blank");

      toast.success("Redirecionando para WhatsApp...");

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const whatsappNumber = "5511999999999"; // Substitua pelo número real
    const message = encodeURIComponent(
      "Olá! Vim pelo site do Brechó do Futuro e gostaria de mais informações.",
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header da página */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Entre em Contato</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Estamos aqui para ajudar! Entre em contato conosco através dos canais
          abaixo ou envie uma mensagem diretamente pelo WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Formulário de Contato */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Envie sua Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Como podemos ajudar?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escreva sua mensagem aqui..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 cursor-pointer"
                  >
                    {loading ? "Enviando..." : "Enviar via WhatsApp"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWhatsAppContact}
                    className="flex-1 cursor-pointer"
                  >
                    Contato Direto
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-6">
          {/* Contato Principal */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-gray-600">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-gray-600">contato@brechodofuturo.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-gray-600">São Paulo, SP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horário de Atendimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Segunda a Sexta</span>
                  <span className="font-medium">9h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="font-medium">9h às 15h</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="font-medium">Fechado</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Dica:</strong> Para respostas mais rápidas, prefira
                  o WhatsApp!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>Siga-nos nas Redes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://instagram.com/brechodofuturo",
                      "_blank",
                    )
                  }
                >
                  <IconBrandInstagram className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() =>
                    window.open("https://facebook.com/brechodofuturo", "_blank")
                  }
                >
                  <IconBrandFacebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() =>
                    window.open("https://twitter.com/brechodofuturo", "_blank")
                  }
                >
                  <IconBrandTwitter className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Acompanhe nossas novidades, promoções e dicas de moda
                sustentável!
              </p>
            </CardContent>
          </Card>

          {/* Sobre o Atendimento */}
          <Card>
            <CardHeader>
              <CardTitle>Como Podemos Ajudar?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Dúvidas sobre produtos</li>
                <li>• Informações sobre entregas</li>
                <li>• Política de trocas e devoluções</li>
                <li>• Sugestões e feedback</li>
                <li>• Parcerias e colaborações</li>
                <li>• Vendas em consignação</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-8">
          <h2 className="mb-4 text-2xl font-bold">Pronto para Começar?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600">
            Explore nossa coleção de peças únicas e encontre aquela roupa
            especial que vai completar seu guarda-roupa com estilo e
            sustentabilidade.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => navigate("/")} className="cursor-pointer">
              Ver Produtos
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsAppContact}
              className="cursor-pointer"
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
