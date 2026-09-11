import AppLayout from "@/components/layouts/AppLayout";
import { listarProjetos } from "@/lib/api";
import FormHipotese from "./form";

export const dynamic = "force-dynamic";

export default async function HipotesePage() {
  const projetos = await listarProjetos();

  if (projetos === null) {
    return (
      <AppLayout titulo="Hipótese de Valor">
        <p>
          API indisponível. Suba com <code>docker compose up -d</code> e recarregue.
        </p>
      </AppLayout>
    );
  }

  if (projetos.length === 0) {
    return (
      <AppLayout titulo="Hipótese de Valor">
        <p>Cadastre um projeto antes de registrar uma hipótese.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      titulo="Hipótese de Valor"
      descricao="Baseline e alvo são obrigatórios: hipótese sem número não pode ser aprovada nem refutada."
    >
      <FormHipotese projetos={projetos} />
    </AppLayout>
  );
}
