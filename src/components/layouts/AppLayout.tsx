import Link from "next/link";
import type { ReactNode } from "react";

export interface AppLayoutProps {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}

const NAV = [
  { href: "/projeto", rotulo: "Projetos" },
  { href: "/hipotese", rotulo: "Nova hipótese" },
] as const;

/**
 * Layout compartilhado por todas as páginas do produto.
 * Composição pura de componentes — sem estado global, sem Context.
 */
export default function AppLayout({ titulo, descricao, children }: AppLayoutProps) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "baseline",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(128,128,128,.3)",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        <Link href="/projeto" style={{ fontWeight: 600, textDecoration: "none" }}>
          Paris Group Copilot
        </Link>
        <nav style={{ display: "flex", gap: 16 }}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.rotulo}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <h1 style={{ marginBottom: descricao ? 4 : 20 }}>{titulo}</h1>
        {descricao && <p style={{ opacity: 0.75, marginBottom: 24 }}>{descricao}</p>}
        {children}
      </main>
    </div>
  );
}
