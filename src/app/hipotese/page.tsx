import { listarProjetos } from "@/lib/api";
import FormHipotese from "./form";

export const dynamic = "force-dynamic";

export default async function HipotesePage() {
  const projetos = await listarProjetos();

  if (projetos === null) {
    return (
      <main style={{ padding: 32, maxWidth: 720 }}>
        <h1>Hipótese de Valor</h1>
        <p>
          API indisponível. Suba com <code>docker compose up -d</code> e recarregue.
        </p>
      </main>
    );
  }

  if (projetos.length === 0) {
    return (
      <main style={{ padding: 32, maxWidth: 720 }}>
        <h1>Hipótese de Valor</h1>
        <p>Cadastre um projeto antes de registrar uma hipótese.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 32, maxWidth: 720 }}>
      <h1>Hipótese de Valor</h1>
      <p style={{ opacity: 0.8 }}>
        Baseline e alvo são obrigatórios: hipótese sem número não pode ser aprovada
        nem refutada.
      </p>
      <FormHipotese projetos={projetos} />
      <p style={{ marginTop: 32 }}>
        <a href="/projeto">← Voltar para projetos</a>
      </p>
    </main>
  );
}
