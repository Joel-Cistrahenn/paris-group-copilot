import Link from "next/link";
import { notFound } from "next/navigation";
import AppLayout from "@/components/layouts/AppLayout";
import { listarHipoteses, listarProjetos, type Hipotese } from "@/lib/api";

export const dynamic = "force-dynamic";

const ROTULO: Record<Hipotese["resultado"], string> = {
  em_teste: "em teste",
  validada: "validada",
  refutada: "refutada",
};

export default async function ProjetoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projetoId = Number(id);

  const projetos = await listarProjetos();
  if (projetos === null) {
    return (
      <AppLayout titulo="Projeto">
        <p>
          API indisponível. Suba com <code>docker compose up -d</code> e recarregue.
        </p>
      </AppLayout>
    );
  }

  const projeto = projetos.find((p) => p.id === projetoId);
  if (!projeto) notFound();

  const hipoteses = (await listarHipoteses(projetoId)) ?? [];

  return (
    <AppLayout titulo={projeto.nome} descricao={projeto.descricao || undefined}>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>
        Hipóteses ({hipoteses.length})
      </h2>

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
