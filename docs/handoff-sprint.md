# Handoff de sprint — Paris Group Copilot

Atualização assíncrona para os investidores da série B. Formato Orca.
Autor: Joel-Cistrahenn · Repositório: `Joel-Cistrahenn/paris-group-copilot`

> Este documento é autossuficiente por desenho: quem ler não deve precisar de
> nenhuma reunião para entender estado, decisões e riscos.

---

## Demo

🎥 **Loom (3 min):** `<colar link aqui após gravar>`

Roteiro cronometrado em [`docs/demo-roteiro.md`](demo-roteiro.md).

---

## 1. Contexto

### O que o produto resolve

Times de studio testam hipóteses em vários produtos e não guardam registro do que
já foi testado. A mesma abordagem descartada meses atrás é re-testada do zero, ao
custo de **2 a 4 dias por ocorrência**.

O Copilot é o registro dessas hipóteses. Cada uma guarda enunciado, métrica,
baseline, alvo e o campo que justifica o produto: `resultado`
(`em_teste` / `validada` / `refutada`).

### O que foi entregue nesta sprint

| Entrega | Estado |
|---|---|
| Frontend Next.js 15 + TypeScript, rotas `/projeto` e `/hipotese` | no ar local |
| Backend FastAPI + SQLAlchemy, contrato OpenAPI em `/docs` | no ar local |
| PostgreSQL 16 via Docker Compose com healthcheck | no ar local |
| Listagem de projetos consumindo a API | entregue |
| Cadastro de hipótese com validação de baseline e alvo | entregue |
| Governança: `AGENTS.md`, PR template, modo `pr` travado | entregue |

### Verificação executada

```
npx tsc --noEmit                    -> 0 erros
npx eslint src                      -> 0 erros
docker compose ps                   -> api Up, db Up (healthy)
curl localhost:8000/health          -> {"status":"ok"}
POST /projetos + POST /hipoteses    -> 201, persistido no Postgres
API derrubada -> tela mostra aviso, log registra "[api] falha em /projetos"
```

---

## 2. As três decisões técnicas da sprint

### 2.1 — `resultado` na modelagem desde o primeiro dia

A tabela `hipoteses` nasceu com o campo `resultado`. Não é refinamento de v2.

**Justificativa:** a pergunta que o produto existe para responder é *"já testaram
isso antes, e deu o quê?"*. Sem o resultado registrado, o sistema vira um
formulário bonito que não responde nada. Campo que sustenta a proposta de valor
entra na primeira migração, não na segunda.

### 2.2 — A IA foi cortada da v1

A sugestão automática de enquadramento, que era a feature mais vendável, saiu do
escopo da primeira versão. A v1 apenas registra e consulta.

**Justificativa:** sem registro acumulado não existe o que sugerir. Entregar IA
sobre base vazia produziria demonstração, não valor — e criaria custo de
manutenção antes de qualquer evidência de uso. A IA entra na v2, quando houver
histórico para ela ler.

### 2.3 — Falha de API: avisa o usuário **e** registra no log

O tratamento de erro foi revisado durante a sprint. A proposta inicial oferecia
duas opções: devolver estado vazio com mensagem amigável (escondendo a causa) ou
deixar o erro estourar na tela (expondo stack trace ao usuário).

**Justificativa:** as duas foram rejeitadas. Não há motivo para escolher entre
usuário informado e erro diagnosticável. A implementação faz as duas coisas — o
usuário lê "API indisponível", o log recebe a causa. Erro silencioso é o que
transforma incidente em mistério.

---

## 3. Bloqueios ativos

| # | Bloqueio | Tipo | Owner | Prazo esperado |
|---|---|---|---|---|
| 1 | Escopo da v1: inclui busca por hipóteses parecidas? | produto | produto | 1 semana |
| 2 | Migrar `api/` para o chassi TypeScript (tRPC + Drizzle) | técnico | lead técnico | 2 semanas |
| 3 | CI ausente — PRs validados só por verificação local | técnico | Joel | 1 semana |

### Por que o bloqueio 1 é o mais crítico

A hipótese de valor do produto é sobre decidir consultando o histórico em vez de
refazer o teste. A métrica de validação conta quantas decisões saem por consulta.

Se a busca não entra na v1, não existe evento de consulta para instrumentar — e
sem instrumentação a hipótese principal não tem como ser testada dentro do ciclo.
O bloqueio 1 para o progresso; o bloqueio 2 apenas acumula dívida já documentada e
reversível.

Critério de priorização: **bloqueio que impede o próximo passo vence bloqueio que
acumula custo.**

---

## 4. Próximos passos

| # | Ação | Responsável | Estimativa | Depende de |
|---|---|---|---|---|
| 1 | Definir escopo da v1 | produto | 1h | — |
| 2 | Instrumentar eventos de cadastro e consulta | Joel | 2h | passo 1 |
| 3 | Configurar CI com `typecheck` como gate do PR | Joel | 1h | — |
| 4 | Medir baseline real com os 3 primeiros usuários | produto | 3h | passo 2 |
| 5 | Decidir migração do `api/` para tRPC + Drizzle | lead técnico | 1h | — |

O passo 2 não pode começar antes do 1: não se instrumenta o que ainda não foi
decidido.

---

## 5. Rastreabilidade

| Item | Referência |
|---|---|
| `FEAT-001` | ligar telas à API — **done** (4/4 subtasks) |
| `CHORE-216` | ambiente local do fluxo Paris Group — **done** (5/5) |
| `CHORE-217` | PR template e README — **done** (3/3) |
| `TASK-002` | este handoff — em andamento |
| PR #1 | `AGENTS.md` — merged |
| PR #2 | setup, README e PR template — merged |
| PR #3 | esta atualização de sprint — aberto |
