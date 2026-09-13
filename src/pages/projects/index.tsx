import type { GetServerSideProps } from "next";
import AppLayout from "@/components/layouts/AppLayout";
import ProjectList from "@/components/projetos/ProjectList";
import { listarHipoteses, listarProjetos, type Hipotese, type Projeto } from "@/lib/api";

interface ProjectsPageProps {
  projetos: Projeto[];
  hipoteses: Hipotese[];
  apiIndisponivel: boolean;
}

/**
 * Espelho em inglês de `/projeto`. Reusa `AppLayout`, `ProjectList` e o cliente
 * tipado — nenhuma linha de navegação ou de domínio é duplicada aqui.
 */
export default function ProjectsPage({
  projetos,
  hipoteses,
  apiIndisponivel,
}: ProjectsPageProps) {
  if (apiIndisponivel) {
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
      <ProjectList projetos={projetos} hipoteses={hipoteses} />
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ProjectsPageProps> = async () => {
  const projetos = await listarProjetos();
  const hipoteses = await listarHipoteses();

  return {
    props: {
      projetos: projetos ?? [],
      hipoteses: hipoteses ?? [],
      apiIndisponivel: projetos === null,
    },
  };
};
