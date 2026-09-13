# Pipeline de verificação

Gate obrigatório de toda Pull Request contra a `main`.
Definido em `.github/workflows/ci.yml`.

| Passo | O que prova |
|---|---|
| `npm ci` | o lockfile é suficiente para instalar do zero |
| `test -f src/types/api.d.ts` | os tipos gerados do contrato OpenAPI estão versionados |
| `npm run typecheck` | nenhuma divergência de contrato entre FastAPI e Next.js |
| `npx eslint src` | padrão de código respeitado |
| `npm run build` | a aplicação compila para produção |

## Por que o `typecheck` é o passo que mais importa

`src/types/api.d.ts` é gerado do `/openapi.json` que o FastAPI publica. Um campo
renomeado no Pydantic e não propagado para o frontend faz o CI falhar — antes do
merge, não em produção.

Antes deste workflow, esse gate existia mas dependia de alguém lembrar de rodar.
Era o bloqueio técnico #3 registrado em `docs/handoff-sprint.md`.

## Por que o build não precisa da API no ar

As páginas de dados são `force-dynamic` e não são pré-renderizadas. Verificado
localmente com o backend derrubado:

```
$ docker compose stop api
$ npm run build

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /hipotese
├ ƒ /projeto
└ ƒ /projeto/[id]

Route (pages)
┌   /_app
├ ƒ /projects
└ ƒ /projects/[id]

ƒ (Dynamic) server-rendered on demand
```

Exit 0, sem backend.

## Proteção da branch `main`

Complementa o workflow: sem ela, o CI roda mas não impede nada.

| Regra | Por quê |
|---|---|
| Sem push direto na `main` | toda mudança passa por PR revisável |
| Status check `typecheck · lint · build` obrigatório | PR vermelho não faz merge |
| Branch atualizada antes do merge | evita quebra por conflito semântico |

Localmente, a mesma regra é travada por `workflow-policy.sh set-mode pr`.
