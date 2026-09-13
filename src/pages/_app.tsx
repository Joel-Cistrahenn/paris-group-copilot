import type { AppProps } from "next/app";

/**
 * Raiz do Pages Router.
 *
 * Existe apenas para dar suporte às rotas em `src/pages/projects/`, que são
 * exigidas pela suíte de avaliação do curso. O roteador canônico do produto é o
 * App Router (`src/app/`) — ver AGENTS.md.
 *
 * O CSS global é importado por `src/app/layout.tsx`; não é reimportado aqui para
 * não duplicar a folha de estilo.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
