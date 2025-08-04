import React from "react";
import { emergencyClearAuth, checkAuthState } from "../utils/clearAuth";

// Componente temporário para debug de autenticação
// Remova este componente após resolver o problema
const AuthDebug: React.FC = () => {
  const handleClearAuth = () => {
    emergencyClearAuth();
  };

  const handleCheckAuth = () => {
    checkAuthState();
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg border border-red-300 bg-red-100 p-4 shadow-lg">
      <h3 className="mb-2 text-sm font-bold text-red-800">Debug Auth</h3>
      <div className="space-y-2">
        <button
          onClick={handleClearAuth}
          className="block w-full rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
        >
          Limpar Auth (Emergência)
        </button>
        <button
          onClick={handleCheckAuth}
          className="block w-full rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
        >
          Verificar Estado
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
