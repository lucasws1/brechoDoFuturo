import { ShoppingCartIcon } from "lucide-react";

export default function TestPage() {
  return (
    <>
      <header className="bg-cream shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <img
            src="/brecho_maquina_v2.png"
            alt="Logo"
            className="h-16 w-auto"
          />

          <div className="mx-6 flex-1">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full rounded border border-gray-300 px-4 py-2 shadow"
            />
          </div>

          <div className="flex items-center gap-4">
            <button>
              <ShoppingCartIcon className="h-6 w-6 text-gray-600" />
            </button>
            <button className="text-sm text-gray-700 hover:underline">
              Entrar
            </button>
          </div>
        </div>

        <nav className="border-t border-gray-200 bg-[#f5f0e8]">
          <ul className="flex justify-center gap-8 py-2 text-sm text-gray-700">
            <li className="hover:underline">Novidades</li>
            <li className="hover:underline">Ofertas</li>
            <li className="hover:underline">Masculino</li>
            <li className="hover:underline">Feminino</li>
            <li className="hover:underline">Infantil</li>
          </ul>
        </nav>
      </header>
    </>
  );
}
