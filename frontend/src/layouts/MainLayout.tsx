import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
// import { Header } from "@/components/Header";
import HeaderTeste from "@/components/HeaderTeste";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col">
      <HeaderTeste />
      {/* <Header /> */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
