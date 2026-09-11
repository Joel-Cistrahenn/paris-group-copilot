# AGENTS.md — Paris Group Copilot

Regras canônicas deste repositório para agentes de IA e humanos.

## O que é este produto

Registro de projetos e hipóteses de um venture studio. A hipótese carrega o
resultado (`em_teste` / `validada` / `refutada`) — é esse campo que responde
"já testaram isso antes?".

Toda feature precisa ser justificável por `docs/enquadramento.md`. Se não está
lá, não entra.

## Estrutura

| Caminho | O que é |
|---|---|
| `src/app/` | Next.js App Router — rotas `/projeto` e `/hipotese` |
| `api/` | FastAPI + SQLAlchemy, contrato OpenAPI em `/docs` |
| `docker-compose.yml` | Postgres + API locais |
| `docs/` | enquadramento, arquitetura, caso de estudo, checkpoint |

## Divergência declarada

Este repo usa FastAPI/OpenAPI por exigência do exercício. O chassi canônico da
Paris Group é Full-TS (Next.js + tRPC + Drizzle). O custo dessa divergência está
registrado em `docs/arquitetura.md`, seção 5. Não replicar em produto da frota.

## Antes de abrir PR

```bash
npx tsc --noEmit          # zero erros
docker compose up -d      # api e db sobem sem erro
curl -s localhost:8000/health
```

## Convenções

- Conventional Commits: `feat(escopo): descrição`, `fix(...)`, `chore(...)`.
- Sem push direto na `main`. Branch + Pull Request, sempre.
- PR precisa de: Contexto, Evidência (saída de comando) e Rastreabilidade.
