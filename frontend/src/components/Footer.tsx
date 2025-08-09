import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-[1240px] py-10 md:py-16">
        <div className="grid grid-cols-1 items-start gap-8 px-4 md:grid-cols-[2fr_1fr_1fr_1fr] xl:px-0">
          <div className="max-w-sm">
            <h3 className="text-xl font-semibold tracking-tight">
              Brechó do Futuro
            </h3>
            <p className="mt-2 text-neutral-600">
              Um presente do passado para o futuro.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                aria-label="Instagram"
                href="#"
                className="rounded p-2 hover:bg-black/5 focus:ring-2 focus:ring-black/20 focus:outline-none"
              >
                <IconBrandInstagram className="h-5 w-5" />
              </a>
              <a
                aria-label="Facebook"
                href="#"
                className="rounded p-2 hover:bg-black/5 focus:ring-2 focus:ring-black/20"
              >
                <IconBrandFacebook className="h-5 w-5" />
              </a>
              <a
                aria-label="WhatsApp"
                href="#"
                className="rounded p-2 hover:bg-black/5 focus:ring-2 focus:ring-black/20"
              >
                <IconBrandWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-labelledby="f-inst">
            <h4 id="f-inst" className="text-sm font-medium text-neutral-900">
              Institucional
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <a href="/quem-somos" className="hover:underline">
                  Quem somos
                </a>
              </li>
              <li>
                <a href="/privacidade" className="hover:underline">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="f-trocas">
            <h4 id="f-trocas" className="text-sm font-medium text-neutral-900">
              Trocas e devoluções
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <a href="/trocas" className="hover:underline">
                  Política de trocas
                </a>
              </li>
              <li>
                <a href="/reembolso" className="hover:underline">
                  Reembolso
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="f-contato">
            <h4 id="f-contato" className="text-sm font-medium text-neutral-900">
              Contato
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>
                <a href="/contato" className="hover:underline">
                  Fale conosco
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/55XXXXXXXXXX"
                  className="hover:underline"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Brechó do Futuro. CNPJ
          00.000.000/0000-00
        </div>
      </div>
    </footer>

    // <footer className="py-10 md:py-12">
    //   <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-4 py-10 text-left text-sm md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] md:px-6 lg:px-8">
    //     <div className="col-span-2 max-w-sm space-y-2">
    //       <div className="text-xl font-semibold tracking-tight">
    //         Brechó do Futuro
    //       </div>
    //       <p className="mt-2 text-neutral-600">
    //         Um presente do passado para o futuro.
    //       </p>
    //       <div className="mt-4 flex items-center gap-4">
    //         <Link to="#" aria-label="Instagram">
    //           <IconBrandInstagram className="h-5 w-5" />
    //         </Link>
    //         <Link to="#" aria-label="Facebook">
    //           <IconBrandFacebook className="h-5 w-5" />
    //         </Link>
    //       </div>
    //     </div>

    //     <nav className="space-y-2">
    //       <h4 className="text-sm font-medium text-neutral-900">
    //         Institucional
    //       </h4>
    //       <ul className="mt-3 space-y-2 text-sm text-neutral-600">
    //         <li>
    //           <a href="/institucional">Quem somos</a>
    //         </li>
    //         <li>
    //           <a href="/privacidade">Política de privacidade</a>
    //         </li>
    //       </ul>
    //     </nav>

    //     <nav className="space-y-2">
    //       <h4 className="text-sm font-medium text-neutral-900">
    //         Trocas e devoluções
    //       </h4>
    //       <ul className="mt-3 space-y-2 text-sm text-neutral-600">
    //         <li>
    //           <a href="/trocas">Política de trocas</a>
    //         </li>
    //       </ul>
    //     </nav>

    //     <nav className="space-y-2">
    //       <h4 className="text-sm font-medium text-neutral-900">Contato</h4>
    //       <ul className="mt-3 space-y-2 text-sm text-neutral-600">
    //         <li>
    //           <a href="/contact">Fale conosco</a>
    //         </li>
    //       </ul>
    //     </nav>
    //   </div>

    //   <div className="py-2 text-center text-xs text-neutral-500">
    //     &copy; 2025 Brechó do Futuro. CNPJ 00.000.000/0000-00
    //   </div>
    // </footer>
  );
}
