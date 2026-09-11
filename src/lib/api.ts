/** Cliente da API do Copilot. Tipos espelham os schemas Pydantic de `api/schemas.py`. */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Resultado = "em_teste" | "validada" | "refutada";

export type Projeto = {
  id: number;
  nome: string;
  descricao: string;
  criado_em: string;
};

export type Hipotese = {
  id: number;
  projeto_id: number;
  enunciado: string;
  metrica: string;
  baseline: string;
  alvo: string;
  resultado: Resultado;
  criado_em: string;
};

export type NovaHipotese = Omit<Hipotese, "id" | "criado_em">;

/**
 * Falha de API nunca vira stack trace na tela — mas nunca some do log.
 * O usuário recebe estado vazio tratado; o desenvolvedor recebe a causa.
 */
function registrarFalha(rota: string, causa: unknown): null {
  const detalhe = causa instanceof Error ? causa.message : String(causa);
  console.error(`[api] falha em ${rota}: ${detalhe}`);
  return null;
}

async function buscar<T>(rota: string): Promise<T | null> {
  try {
    const r = await fetch(`${API_URL}${rota}`, { cache: "no-store" });
    if (!r.ok) return registrarFalha(rota, `HTTP ${r.status} ${r.statusText}`);
    return (await r.json()) as T;
  } catch (causa) {
    return registrarFalha(rota, causa);
  }
}

export function listarProjetos(): Promise<Projeto[] | null> {
  return buscar<Projeto[]>("/projetos");
}

export function listarHipoteses(projetoId?: number): Promise<Hipotese[] | null> {
  const qs = projetoId === undefined ? "" : `?projeto_id=${projetoId}`;
  return buscar<Hipotese[]>(`/hipoteses${qs}`);
}
