import { Footer } from "./Footer";
import { Header } from "./Header";

type SiteLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}