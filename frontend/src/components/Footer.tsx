import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background mt-8 border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-left md:grid-cols-5">
        {/* Logo + descrição */}
        <div className="col-span-2 space-y-3">
          <div className="font-serif text-lg font-bold">Brechó do Futuro</div>
          <p className="text-muted-foreground font-sans text-sm">
            Moda sustentável para todos. Peças únicas, preços justos.
          </p>
          <div className="mt-2 flex gap-3">
            <Link to="#" aria-label="Instagram">
              <IconBrandInstagram className="h-5 w-5" />
            </Link>
            <Link to="#" aria-label="Facebook">
              <IconBrandFacebook className="h-5 w-5" />
            </Link>
            <Link to="#" aria-label="Twitter">
              <IconBrandTwitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
        {/* Institucional */}
        <div>
          <div className="mb-2 font-serif font-semibold">Institucional</div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="#">Quem somos</Link>
            </li>
            <li>
              <Link to="#">Política de Privacidade</Link>
            </li>
            <li>
              <Link to="#">Trocas & Devoluções</Link>
            </li>
            <li>
              <Link to="#">FAQ</Link>
            </li>
          </ul>
        </div>
        {/* Categorias */}
        <div>
          <div className="mb-2 font-serif font-semibold">Categorias</div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="#">Masculino</Link>
            </li>
            <li>
              <Link to="#">Feminino</Link>
            </li>
            <li>
              <Link to="#">Infantil</Link>
            </li>
            <li>
              <Link to="#">Ofertas</Link>
            </li>
          </ul>
        </div>
        {/* Minha Conta */}
        <div>
          <div className="mb-2 font-serif font-semibold">Minha Conta</div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="#">Meus pedidos</Link>
            </li>
            <li>
              <Link to="#">Endereços</Link>
            </li>
            <li>
              <Link to="#">Sair</Link>
            </li>
          </ul>
          <div className="mt-4 flex flex-col items-start">
            <Link to="/contact" className="font-serif font-bold">
              Entre em Contato
            </Link>
            <Link to="/contact" className="">
              Clique aqui para falar conosco
            </Link>
          </div>
        </div>
      </div>
      <div className="text-muted-foreground py-2 text-center text-xs">
        &copy; {new Date().getFullYear()} Brechó do Futuro. CNPJ
        00.000.000/0000-00
      </div>
    </footer>
  );
}
