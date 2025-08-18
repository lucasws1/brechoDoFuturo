import { useState, useEffect } from "react";

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Define o estado inicial
    setMatches(media.matches);

    // Função para atualizar o estado quando a media query mudar
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adiciona o listener
    media.addEventListener("change", listener);

    // Cleanup: remove o listener quando o componente for desmontado
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// Hooks pré-definidos para breakpoints comuns
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
