# Paris Group Copilot

Copiloto de venture studio para discovery e execução de MVPs com IA.

Registro de projetos e hipóteses: cada hipótese guarda o resultado
(`em_teste` / `validada` / `refutada`). É esse campo que responde a pergunta que
justifica o produto — *"já testaram isso antes?"*.

## Rodando local

```bash
npm install
npm run dev                 # Next.js em localhost:3000
docker compose up -d        # API em localhost:8000, Postgres em 5432
```

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 — rotas `/projeto` e `/hipotese` |
| API + Swagger | http://localhost:8000/docs |
| Health | http://localhost:8000/health |

## Verificação antes do PR

```bash
npx tsc --noEmit
docker compose ps
curl -s localhost:8000/health
```

## Documentação

- [Enquadramento do problema](docs/enquadramento.md) — contexto, dor, hipótese de valor e métrica.
- [Arquitetura da stack](docs/arquitetura.md) — justificativa de cada componente e divergência declarada em relação ao chassi da Paris Group.
- [Caso Fênix Studio](docs/caso-fenix.md) — estudo de caso: enquadramento, hipótese, stack e ciclo de vida em 6 semanas.
- [Checkpoint Módulo 1](docs/checkpoint-modulo-1.md) — verificação de aprendizado.
- [AGENTS.md](AGENTS.md) — regras canônicas para agentes de IA e humanos.

## Convenções

Conventional Commits, sem push direto na `main`, PR com Contexto + Evidência +
Rastreabilidade. Ver `AGENTS.md`.
