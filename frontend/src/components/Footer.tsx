import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <footer className="mt-8 border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-left md:grid-cols-5">
        {/* Logo + descrição */}
        <div className="col-span-2 space-y-3">
          <div className="text-lg font-bold">Brechó do Futuro</div>
          <p className="text-sm text-muted-foreground">
            Moda sustentável para todos. Peças únicas, preços justos.
          </p>
          <div className="mt-2 flex gap-3">
            <a href="#" aria-label="Instagram">
              <IconBrandInstagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook">
              <IconBrandFacebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter">
              <IconBrandTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        {/* Institucional */}
        <div>
          <div className="mb-2 font-semibold">Institucional</div>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">Quem somos</a>
            </li>
            <li>
              <a href="#">Política de Privacidade</a>
            </li>
            <li>
              <a href="#">Trocas & Devoluções</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>
        {/* Categorias */}
        <div>
          <div className="mb-2 font-semibold">Categorias</div>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">Masculino</a>
            </li>
            <li>
              <a href="#">Feminino</a>
            </li>
            <li>
              <a href="#">Infantil</a>
            </li>
            <li>
              <a href="#">Ofertas</a>
            </li>
          </ul>
        </div>
        {/* Minha Conta */}
        <div>
          <div className="mb-2 font-semibold">Minha Conta</div>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#">Meus pedidos</a>
            </li>
            <li>
              <a href="#">Endereços</a>
            </li>
            <li>
              <a href="#">Sair</a>
            </li>
          </ul>
          <div className="mt-4">
            <div className="font-semibold">Contato</div>
            <div className="text-sm">contato@brechodofuturo.com</div>
            <div className="text-sm">WhatsApp: (11) 99999-9999</div>
          </div>
        </div>
      </div>
      <div className="py-2 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Brechó do Futuro. CNPJ
        00.000.000/0000-00
      </div>
    </footer>
  );
}
