/**
 * Cliente da API do Copilot.
 *
 * Os tipos NÃO são escritos à mão: `src/types/api.d.ts` é gerado a partir do
 * contrato OpenAPI que o FastAPI publica em /openapi.json. Regenere com:
 *
 *   npm run gen:api        (com a API no ar)
 *
 * Consequência prática: se um campo mudar no Pydantic e o front continuar lendo
 * o nome antigo, `npx tsc --noEmit` falha. A divergência vira erro de compilação
 * em vez de `undefined` em produção.
 */

import createClient from "openapi-fetch";
import type { components, paths } from "@/types/api";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = createClient<paths>({ baseUrl: API_URL });

export type Projeto = components["schemas"]["ProjetoOut"];
export type Hipotese = components["schemas"]["HipoteseOut"];
export type NovaHipotese = components["schemas"]["HipoteseCreate"];
export type Resultado = NovaHipotese["resultado"];

/**
 * Falha de API nunca vira stack trace na tela — mas nunca some do log.
 * O usuário recebe estado vazio tratado; o desenvolvedor recebe a causa.
 */
function registrarFalha(rota: string, causa: unknown): null {
  const detalhe = causa instanceof Error ? causa.message : String(causa);
  console.error(`[api] falha em ${rota}: ${detalhe}`);
  return null;
}

export async function listarProjetos(): Promise<Projeto[] | null> {
  try {
    const { data, error } = await api.GET("/projetos", { cache: "no-store" });
    if (error || !data) return registrarFalha("/projetos", error ?? "resposta vazia");
    return data;
  } catch (causa) {
    return registrarFalha("/projetos", causa);
  }
}

export async function listarHipoteses(projetoId?: number): Promise<Hipotese[] | null> {
  try {
    const { data, error } = await api.GET("/hipoteses", {
      params: { query: projetoId === undefined ? {} : { projeto_id: projetoId } },
      cache: "no-store",
    });
    if (error || !data) return registrarFalha("/hipoteses", error ?? "resposta vazia");
    return data;
  } catch (causa) {
    return registrarFalha("/hipoteses", causa);
  }
}

export async function criarHipotese(
  payload: NovaHipotese,
): Promise<{ ok: true; hipotese: Hipotese } | { ok: false; erro: string }> {
  try {
    const { data, error } = await api.POST("/hipoteses", { body: payload });
    if (error || !data) {
      const detalhe =
        error && typeof error === "object" && "detail" in error
          ? String((error as { detail: unknown }).detail)
          : "erro ao registrar hipótese";
      console.error(`[api] falha em POST /hipoteses: ${detalhe}`);
      return { ok: false, erro: detalhe };
    }
    return { ok: true, hipotese: data };
  } catch (causa) {
    registrarFalha("POST /hipoteses", causa);
    return { ok: false, erro: "Não foi possível falar com a API." };
  }
}
