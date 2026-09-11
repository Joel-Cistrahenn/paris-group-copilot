# Handoff — Paris Group Copilot (bloco de onboarding)

Formato Orca. Autor: Joel-Cistrahenn. Repositório:
https://github.com/Joel-Cistrahenn/paris-group-copilot

---

## 1. Contexto

### O que foi construído

O esqueleto completo do Paris Group Copilot, com produto e infraestrutura
funcionando localmente.

| Camada | Estado |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind, App Router, rotas `/projeto` e `/hipotese` |
| Backend | FastAPI + SQLAlchemy em `api/`, contrato OpenAPI automático em `/docs` |
| Dados | PostgreSQL 16 via Docker Compose, com healthcheck |
| Documentação | enquadramento, arquitetura, caso de estudo, checkpoint e `AGENTS.md` |

### Modelagem

Duas entidades. `Projeto` agrupa hipóteses. `Hipotese` carrega `enunciado`,
`metrica`, `baseline`, `alvo` e — o campo que justifica o produto — `resultado`
(`em_teste` / `validada` / `refutada`). Sem esse último campo o sistema não
responde "já testaram isso antes?", que é a pergunta que o produto existe para
responder.

### Testes de aceitação executados

```
npx tsc --noEmit                         -> 0 erros
docker compose ps                        -> api Up, db Up (healthy)
curl localhost:8000/health               -> {"status":"ok"}
curl localhost:3000/projeto              -> HTTP 200, conteúdo renderizado
curl localhost:3000/hipotese             -> HTTP 200, conteúdo renderizado
POST /projetos + POST /hipoteses         -> 201, gravado e lido do Postgres
GET /hipoteses?projeto_id=1              -> filtro funcionando
workflow-policy.sh get-mode              -> pr
```

### Ambiente da frota

`pg-devkit` 0.164.2 diagnosticado, governança de branch travada em modo `pr`,
`tn` 0.15.0 compilado do `parisgroup-ai/tasknotes-cli`, PG-Vault consolidado em
`~/www/pg/PG-Vault` (havia clone duplicado — removido), `tasknotes-cli` e
`graphify` clonados em `~/www/pg/apps/`.

### Rastreabilidade

- `CHORE-216` — ambiente local do fluxo Paris Group — **done**
- `CHORE-217` — PR template e README — em andamento (PR #2)
- `TASK-002` — este handoff — em andamento
- PR #1 — `AGENTS.md` com regras canônicas — aberto, aguardando revisão
- PR #2 — setup, README e PR template — aberto, aguardando revisão

---

## 2. Decisões pendentes

### 2.1 — Técnica: o backend contradiz o chassi Full-TS

**O que está em aberto.** O diretório `api/` roda FastAPI com contrato OpenAPI. O
chassi canônico da Paris Group é 100% TypeScript — Next.js + tRPC + Drizzle — e a
própria formação classifica a combinação "Python separado + OpenAPI" como falso
atalho, por produzir divergência silenciosa de schema e alucinação de payload
quando agentes de IA escrevem o código.

**Por que bloqueia.** Não bloqueia a execução — o repositório funciona e a
divergência está declarada em `docs/arquitetura.md` (seção 5) e repetida no
`AGENTS.md`. Bloqueia a **reutilização**: enquanto não houver decisão, ninguém
sabe se este repo serve de referência para os próximos produtos ou se precisa de
um aviso permanente de "não copiar daqui". Num studio, repositório ambíguo
contamina a frota.

**Opções.** (a) manter como está, com o aviso de não replicar; (b) migrar `api/`
para rotas tRPC + Drizzle dentro do próprio Next.js — a modelagem das entidades
não muda, muda quem garante o contrato: o compilador em vez de um documento.

**Owner sugerido:** lead técnico.

### 2.2 — Produto: o que entra na v1, agora que a IA foi cortada

**O que está em aberto.** A sugestão automática por IA foi deliberadamente
movida para a v2, porque sem registro acumulado de hipóteses não existe o que
sugerir. Isso deixa a v1 sem definição: ela é só o cadastro de projetos e
hipóteses, ou já inclui a busca por hipóteses parecidas?

**Por que bloqueia.** Define o que instrumentar. A hipótese de valor do produto é
sobre a Marina decidir consultando histórico em vez de refazer o teste — e a
métrica de validação é quantas decisões saem por consulta. Se a busca não está na
v1, não há evento de consulta para medir, e a hipótese principal fica sem forma de
ser testada dentro do ciclo.

**Owner sugerido:** produto.

### Qual é a mais crítica

**A 2.2.**

A decisão técnica gera dívida com custo conhecido: o sistema funciona, a
divergência está documentada e a migração é reversível a qualquer momento. Dívida
declarada é administrável.

A decisão de produto para o progresso. Sem escopo definido não há o que
instrumentar; sem instrumentação não há baseline; sem baseline a etapa de
qualidade do modelo fica impossível de executar, não apenas difícil. Todo o ciclo
seguinte depende dela.

Critério que uso para ordenar: **bloqueio que impede o próximo passo vence
bloqueio que apenas acumula custo.**

---

## 3. Bloqueios e riscos

| Risco | Impacto | Owner |
|---|---|---|
| Escopo da v1 indefinido | trava instrumentação e validação da hipótese | produto |
| `api/` fora do chassi | repo pode ser copiado por engano na frota | lead técnico |
| Nenhum CI configurado | PRs são validados só por verificação local | Joel |
| Sem instrumentação de eventos | sem baseline, a hipótese não tem como ser refutada | Joel |

---

## 4. Próximos passos

| # | Ação | Responsável | Estimativa |
|---|---|---|---|
| 1 | Definir escopo da v1: só cadastro, ou cadastro + busca por similaridade | produto | 1h |
| 2 | Revisar e mergear PR #1 e PR #2 | lead técnico | 30min |
| 3 | Instrumentar eventos de cadastro e de consulta ao histórico | Joel | 2h |
| 4 | Configurar CI com `typecheck` como gate obrigatório do PR | Joel | 1h |
| 5 | Decidir migração do `api/` para tRPC + Drizzle | lead técnico | 1h |

A ordem não é negociável nos dois primeiros itens: o passo 3 depende do 1, porque
não dá para instrumentar o que ainda não foi decidido.
