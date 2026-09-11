import { listarProjetos, listarHipoteses } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProjetoPage() {
  const projetos = await listarProjetos();
  const hipoteses = await listarHipoteses();

  if (projetos === null) {
    return (
      <main style={{ padding: 32, maxWidth: 720 }}>
        <h1>Projeto</h1>
        <p>
          API indisponível. Suba com <code>docker compose up -d</code> e recarregue.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 32, maxWidth: 720 }}>
      <h1>Projetos</h1>

      {projetos.length === 0 ? (
        <p>Nenhum projeto cadastrado ainda.</p>
      ) : (
        <ul style={{ lineHeight: 1.9 }}>
          {projetos.map((p) => {
            const n = hipoteses?.filter((h) => h.projeto_id === p.id).length ?? 0;
            return (
              <li key={p.id}>
                <strong>{p.nome}</strong> — {p.descricao || "sem descrição"}{" "}
                <span style={{ opacity: 0.7 }}>({n} hipótese{n === 1 ? "" : "s"})</span>
              </li>
            );
          })}
        </ul>
      )}

      <p style={{ marginTop: 32 }}>
        <a href="/hipotese">Cadastrar hipótese →</a>
      </p>
    </main>
  );
}
