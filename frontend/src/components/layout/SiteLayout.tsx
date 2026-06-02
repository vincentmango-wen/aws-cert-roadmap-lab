import type { ReactElement, ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type SiteLayoutProps = {
  children: ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps): ReactElement {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-slate-50 text-slate-950">
      <Header />

      <main id="main-content" className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}