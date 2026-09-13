import type { Hipotese, Projeto } from "@/lib/api";
import ProjectCard from "./ProjectCard";

export interface ProjectListProps {
  projetos: Projeto[];
  hipoteses: Hipotese[];
  vazio?: string;
}

/** Lista de projetos. Cruza as hipóteses para mostrar o progresso de cada um. */
export default function ProjectList({ projetos, hipoteses, vazio }: ProjectListProps) {
  if (projetos.length === 0) {
    return <p>{vazio ?? "Nenhum projeto cadastrado ainda."}</p>;
  }

  return (
    <section>
      {projetos.map((projeto) => {
        const doProjeto = hipoteses.filter((h) => h.projeto_id === projeto.id);
        return (
          <ProjectCard
            key={projeto.id}
            projeto={projeto}
            totalHipoteses={doProjeto.length}
            validadas={doProjeto.filter((h) => h.resultado === "validada").length}
          />
        );
      })}
    </section>
  );
}
