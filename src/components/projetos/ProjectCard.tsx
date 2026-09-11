import Link from "next/link";
import type { Projeto } from "@/lib/api";

export interface ProjectCardProps {
  projeto: Projeto;
  totalHipoteses: number;
  validadas: number;
}

const caixa = {
  border: "1px solid rgba(128,128,128,.3)",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
};

/** Um projeto do studio, com o estado das hipóteses que ele acumula. */
export default function ProjectCard({
  projeto,
  totalHipoteses,
  validadas,
}: ProjectCardProps) {
  const criadoEm = new Date(projeto.criado_em).toLocaleDateString("pt-BR");
  const status = totalHipoteses === 0 ? "sem hipóteses" : `${validadas}/${totalHipoteses} validadas`;

  return (
    <article style={caixa}>
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>
        <Link href={`/projeto/${projeto.id}`}>{projeto.nome}</Link>
      </h2>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>
        {projeto.descricao || "sem descrição"}
      </p>
      <p style={{ fontSize: 13, opacity: 0.65 }}>
        {status} · criado em {criadoEm}
      </p>
    </article>
  );
}
