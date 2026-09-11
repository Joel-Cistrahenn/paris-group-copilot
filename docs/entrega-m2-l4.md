# Entrega — Módulo 2, Lição 4 (Guiado)

## Etapa 1 — Ambiente local

```
node v24.19.0  |  gh: autenticado como Joel-Cistrahenn, membro de parisgroup-ai (SSO ok)
npx tsc --noEmit -> 0 erros
```

## Etapa 2 — Governança pg-devkit

```
  ✓ pg-baseline: version 0.164.2
  ✓ gh CLI: found at /opt/homebrew/bin/gh
  ✓ devkit state: baseline 0.164.2
workflow-policy.sh get-mode -> pr
```

## Etapa 3 — TaskNotes: 3 tarefas, 1 concluída

```
CHORE-216
  Title:    Configurar ambiente local do fluxo Paris Group (devkit, tn, workflow-policy)
  Status:   done
  Priority: high
  Estimate: 1h 00m
  Tags:     task, chore

CHORE-217 (0/3) Adicionar PR template e README no paris-group-copilot
TASK-002 (0/3) Registrar handoff Orca da sessao de onboarding
```

CHORE-216 está `done` com 5 subtasks marcadas; CHORE-217 e TASK-002 seguem abertas com checklist visível.

## Etapa 4 — Branch, commit e PR

```
branch: feat/onboarding-setup-joel-cistrahenn
57ad5f1 feat(setup): configurar ambiente de desenvolvimento local
PR #2: https://github.com/Joel-Cistrahenn/paris-group-copilot/pull/2
PR #1: https://github.com/Joel-Cistrahenn/paris-group-copilot/pull/1 (AGENTS.md)
```

Arquivos do repositório exigidos:

- .github/pull_request_template.md
- .gitignore
- README.md

## Etapa 5 — Handoff estruturado (formato Orca)

# Handoff (formato Orca)

## Contexto

Ambiente local do fluxo Paris Group configurado e validado ponta a ponta:
`pg-devkit` 0.164.2, governança de branch em modo `pr`, `tn` 0.15.0 compilado do
`tasknotes-cli`, PG-Vault consolidado em `~/www/pg/PG-Vault` (havia um clone
duplicado, removido) e `tasknotes-cli` + `graphify` clonados em `~/www/pg/apps/`.

O repositório `paris-group-copilot` tem Next.js + TypeScript rodando, backend
FastAPI com Postgres via Docker Compose, contrato OpenAPI em `/docs` e quatro
documentos de produto e arquitetura em `docs/`.

## Decisões pendentes

**1. Técnica — o `api/` em FastAPI contradiz o chassi Full-TS.**
O exercício do curso exige FastAPI + OpenAPI, mas a Lição 3 do Módulo 1 classifica
exatamente esse arranjo como "falso atalho" e o padrão da frota é tRPC + Drizzle.
Bloqueia porque define se este repo serve como referência para outros produtos ou
se precisa de um aviso permanente de "não copiar daqui".
*Owner sugerido: lead técnico.*

**2. Produto — o que o Copilot faz na v1, dado que a IA foi cortada.**
A v1 apenas busca hipóteses parecidas e mostra o resultado de cada uma; a sugestão
automática ficou para a v2, porque sem registro acumulado não há o que sugerir.
Bloqueia a próxima etapa porque define se o MVP precisa de uma tela de cadastro
antes de qualquer inteligência, ou se a busca por similaridade já entra na v1.
*Owner sugerido: produto.*

**Mais crítica: a decisão 2.** A divergência técnica já está documentada e tem
custo conhecido — o repositório funciona e é auditável. Já a indefinição de escopo
da v1 trava o próximo ciclo inteiro: sem saber o que entra, não há o que
instrumentar, e sem instrumentação não há como validar a hipótese. É a decisão que
para o progresso, não a que gera dívida.

## Próximos passos

| # | Ação | Responsável | Estimativa |
|---|---|---|---|
| 1 | Definir escopo da v1 (só cadastro ou cadastro + busca) | produto | 1h |
| 2 | Revisar e mergear PR #1 (`AGENTS.md`) e este PR | lead técnico | 30min |
| 3 | Instrumentar eventos de cadastro de projeto e hipótese | Joel | 2h |
| 4 | Decidir se o `api/` migra para tRPC + Drizzle | lead técnico | 1h |
