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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
