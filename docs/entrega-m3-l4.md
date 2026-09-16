# Entrega — Módulo 3, Lição 4: CI e proteção de branch

Cenário Helix Ventures. Repositório:
https://github.com/Joel-Cistrahenn/paris-group-copilot

---

## 1. Código no remoto com estrutura de branches adequada

`main` protegida, sem push direto. Todo trabalho transita por branch dedicada e
Pull Request.

```
PR #1  chore(docs): AGENTS.md com regras canônicas           MERGED
PR #2  feat(setup): ambiente de desenvolvimento local        MERGED
PR #4  feat(api): cliente tipado gerado do OpenAPI           MERGED
PR #5  feat(ui): layout, componentes e validação de config   MERGED
PR #6  ci: workflow de typecheck, lint e build               OPEN — CI verde
```

## 2. GitHub Actions rodando em todo PR contra a main

`.github/workflows/ci.yml`:

```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
```

| Passo | O que prova |
|---|---|
| `npm ci` | o lockfile instala do zero |
| `test -f src/types/api.d.ts` | os tipos do contrato OpenAPI estão versionados |
| `npm run typecheck` | nenhuma divergência entre FastAPI e Next.js |
| `npx eslint src` | padrão de código respeitado |
| `npm run build` | compila para produção |

## 3. O workflow passa

```
$ gh pr checks 6
typecheck · lint · build    pass    32s
https://github.com/Joel-Cistrahenn/paris-group-copilot/actions/runs/35049273119
```

### O CI encontrou um bug real na primeira execução

Antes de passar, o workflow reprovou com:

```
src/app/layout.tsx(20,50): error TS2304: Cannot find name 'LayoutProps'.
```

`LayoutProps<"/">` é um tipo que o Next.js gera dentro de `.next/types/` durante o
build. Na máquina do autor o typecheck passava porque `.next` existia de builds
anteriores — em ambiente limpo, quebrava.

Ou seja: **o gate local estava passando por causa de artefato de build.** O CI
achou isso no primeiro dia de vida.

Correção: trocar o tipo gerado por um explícito, que não depende de artefato.

```tsx
- export default function RootLayout({ children }: LayoutProps<"/">) {
+ export default function RootLayout({ children }: { children: ReactNode }) {
```

Reproduzido localmente nas mesmas condições do CI:

```
$ rm -rf .next
$ npx tsc --noEmit     -> exit 0
$ npx eslint src       -> exit 0
```

## 4. Proteção da branch `main`

```
$ gh api repos/Joel-Cistrahenn/paris-group-copilot/branches/main/protection
{
  "checks": ["typecheck · lint · build"],
  "strict": true,
  "enforce_admins": true,
  "force_push": false,
  "delecao": false
}
```

### A primeira configuração não protegia nada

Com `enforce_admins: false`, o push direto do dono do repositório passou:

```
$ git push origin main
remote: - Required status check "typecheck · lint · build" is expected.
   4e3ef31..c267492  main -> main        ← ENTROU
```

O GitHub avisou e deixou passar, porque administrador ficava de fora da regra.
Regra que o dono ignora não é proteção — é sugestão.

Com `enforce_admins: true`:

```
$ git push origin main
remote: - Required status check "typecheck · lint · build" is expected.
 ! [remote rejected] main -> main (protected branch hook declined)
```

Recusado para todo mundo, inclusive o dono. O commit de teste foi removido da
`main` em seguida.

## 5. PR de exemplo com o status check visível

**PR #6:** https://github.com/Joel-Cistrahenn/paris-group-copilot/pull/6

Status check `typecheck · lint · build` verde, visível na PR e exigido pela
proteção da `main` antes do merge.

---

## O que isso fecha

Bloqueio técnico #3 de `docs/handoff-sprint.md`: *"CI ausente — PRs são validados
só por verificação local"*. Owner: Joel. Estimativa: 1h.

Até aqui, `npm run typecheck` era gate por disciplina. Como `src/types/api.d.ts` é
gerado do `/openapi.json` do FastAPI, bastava alguém esquecer de rodar para um PR
entrar com contrato divergente entre Pydantic e TypeScript.

Agora é máquina que verifica, em toda entrega — humana ou de agente. É exatamente
o argumento da lição: quando a IA gera código rápido, o CI é o que impede
velocidade de virar risco.

## Nota de processo

O `ci.yml` teve de ser criado pela interface web do GitHub. O token do `gh` CLI
nesta máquina não tem o escopo `workflow`, e o fluxo `gh auth refresh -s workflow`
não completa dentro do prazo do device flow. Registrado para quem repetir o passo.
