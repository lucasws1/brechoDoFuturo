import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
