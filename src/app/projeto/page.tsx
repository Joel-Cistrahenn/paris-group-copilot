import AppLayout from "@/components/layouts/AppLayout";
import ProjectList from "@/components/projetos/ProjectList";
import { listarHipoteses, listarProjetos } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProjetoPage() {
  const projetos = await listarProjetos();
  const hipoteses = await listarHipoteses();

  if (projetos === null) {
    return (
      <AppLayout titulo="Projetos">
        <p>
          API indisponível. Suba com <code>docker compose up -d</code> e recarregue.
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      titulo="Projetos"
      descricao="Cada projeto acumula as hipóteses já testadas pelo studio e o resultado de cada uma."
    >
      <ProjectList projetos={projetos} hipoteses={hipoteses ?? []} />
    </AppLayout>
  );
}
