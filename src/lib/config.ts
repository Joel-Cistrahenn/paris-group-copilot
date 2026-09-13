/**
 * Configuração lida do ambiente, validada de forma síncrona na importação.
 *
 * Em produção, variável obrigatória ausente derruba o processo com erro
 * descritivo — falhar no boot é melhor que falhar no primeiro pedido do usuário.
 * Em desenvolvimento, usa fallback e avisa no console.
 */

type Config = {
  apiUrl: string;
  databaseUrl: string;
  redisUrl: string;
  ambiente: "development" | "production" | "test";
};

const OBRIGATORIAS = ["NEXT_PUBLIC_API_URL", "DATABASE_URL", "REDIS_URL"] as const;

const PADRAO: Record<(typeof OBRIGATORIAS)[number], string> = {
  NEXT_PUBLIC_API_URL: "http://localhost:8000",
  DATABASE_URL: "postgresql://copilot:copilot@localhost:5432/copilot",
  REDIS_URL: "redis://localhost:6379",
};

function ler(nome: (typeof OBRIGATORIAS)[number], producao: boolean): string {
  const valor = process.env[nome];
  if (valor) return valor;

  if (producao) {
    throw new Error(
      `Configuração ausente: ${nome}. Defina esta variável no ambiente de produção. ` +
        `As obrigatórias são: ${OBRIGATORIAS.join(", ")}. ` +
        `Veja .env.production.example para o formato esperado.`,
    );
  }

  console.warn(`[config] ${nome} não definida — usando fallback de desenvolvimento.`);
  return PADRAO[nome];
}

function carregar(): Config {
  const ambiente = (process.env.NODE_ENV ?? "development") as Config["ambiente"];
  const producao = ambiente === "production";

  return {
    apiUrl: ler("NEXT_PUBLIC_API_URL", producao),
    databaseUrl: ler("DATABASE_URL", producao),
    redisUrl: ler("REDIS_URL", producao),
    ambiente,
  };
}

export const config: Config = carregar();
