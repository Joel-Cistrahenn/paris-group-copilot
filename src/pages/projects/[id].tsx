import type { GetServerSideProps } from "next";
import Link from "next/link";
import AppLayout from "@/components/layouts/AppLayout";
import { listarHipoteses, listarProjetos, type Hipotese, type Projeto } from "@/lib/api";

const ROTULO: Record<Hipotese["resultado"], string> = {
  em_teste: "em teste",
  validada: "validada",
  refutada: "refutada",
};

interface ProjectDetailProps {
  projeto: Projeto | null;
  hipoteses: Hipotese[];
  apiIndisponivel: boolean;
}

/** Espelho em inglês de `/projeto/[id]`. Mesmo `AppLayout`, mesmo cliente tipado. */
export default function ProjectDetailPage({
  projeto,
  hipoteses,
  apiIndisponivel,
}: ProjectDetailProps) {
  if (apiIndisponivel || !projeto) {
    return (
      <AppLayout titulo="Projeto">
        <p>
          {apiIndisponivel
            ? "API indisponível. Suba com docker compose up -d e recarregue."
            : "Projeto não encontrado."}
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href="/projeto">← Todos os projetos</Link>
        </p>
      </AppLayout>
    );
  }

  return (
    <AppLayout titulo={projeto.nome} descricao={projeto.descricao || undefined}>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Hipóteses ({hipoteses.length})</h2>

      {hipoteses.length === 0 ? (
        <p>
          Nenhuma hipótese registrada. <Link href="/hipotese">Cadastrar a primeira →</Link>
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {hipoteses.map((h) => (
            <li
              key={h.id}
              style={{
                border: "1px solid rgba(128,128,128,.3)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <p style={{ marginBottom: 8 }}>{h.enunciado}</p>
              <p style={{ fontSize: 13, opacity: 0.7 }}>
                {h.metrica}: {h.baseline || "—"} → {h.alvo || "—"} ·{" "}
                <strong>{ROTULO[h.resultado]}</strong>
              </p>
            </li>
          ))}
        </ul>
      )}

      <p style={{ marginTop: 24 }}>
        <Link href="/projeto">← Todos os projetos</Link>
      </p>
    </AppLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ProjectDetailProps> = async (ctx) => {
  const projetoId = Number(ctx.params?.id);
  const projetos = await listarProjetos();

  if (projetos === null) {
    return { props: { projeto: null, hipoteses: [], apiIndisponivel: true } };
  }

  const projeto = projetos.find((p) => p.id === projetoId) ?? null;
  if (!projeto) return { notFound: true };

  const hipoteses = (await listarHipoteses(projetoId)) ?? [];

  return { props: { projeto, hipoteses, apiIndisponivel: false } };
};
