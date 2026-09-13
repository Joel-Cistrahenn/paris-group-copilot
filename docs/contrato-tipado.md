# Contrato tipado entre FastAPI e Next.js

## O problema que isto resolve

Até aqui, os tipos de `Projeto` e `Hipotese` existiam duas vezes: declarados em
Pydantic no backend e reescritos à mão em TypeScript no frontend. A cópia manual
é o "falso atalho" que `docs/arquitetura.md` já registrava como custo da
divergência do chassi — se um campo mudasse de nome no Python, o front continuaria
lendo o nome antigo e receberia `undefined`. Nada quebraria no build; quebraria
em produção, com usuário na frente.

## Como ficou

`src/types/api.d.ts` é **gerado** a partir do `/openapi.json` que o FastAPI
publica. Nunca é editado à mão.

```bash
npm run gen:api    # com a API no ar
```

O cliente em `src/lib/api.ts` usa `openapi-fetch` tipado por esse arquivo:

```ts
import createClient from "openapi-fetch";
import type { components, paths } from "@/types/api";

export const api = createClient<paths>({ baseUrl: API_URL });

export type Projeto = components["schemas"]["ProjetoOut"];
export type Hipotese = components["schemas"]["HipoteseOut"];
export type NovaHipotese = components["schemas"]["HipoteseCreate"];
```

Nenhum tipo de domínio é escrito à mão no frontend. A fonte da verdade é o
schema Pydantic.

## Prova de que o gate funciona

Renomeamos deliberadamente `metrica` para `metrica_principal` em
`api/schemas.py`, reconstruímos a API e regeneramos os tipos:

```
$ curl -s localhost:8000/openapi.json | ... HipoteseCreate
['projeto_id', 'enunciado', 'metrica_principal', 'baseline', 'alvo', 'resultado']

$ npm run gen:api
🚀 http://localhost:8000/openapi.json → src/types/api.d.ts

$ npx tsc --noEmit
src/app/hipotese/form.tsx(21,7): error TS2353: Object literal may only specify
known properties, and 'metrica' does not exist in type '{ projeto_id: number;
enunciado: string; metrica_principal: string; baseline: string; alvo: string;
resultado: "em_teste" | "validada" | "refutada"; }'.
```

A mudança de contrato virou **erro de compilação**. Antes, teria virado campo
vazio em produção.

Revertido em seguida: `npx tsc --noEmit` volta a passar com 0 erros e as rotas
`/projeto` e `/hipotese` respondem 200.

## Nota sobre o material do curso

A Lição 2 do Módulo 3 instrui a rodar:

```bash
pageshell init paris-group-copilot --template next-fastapi --with-api ...
```

Esse comando **não existe**. O pacote `@parisgroup-ai/pageshell` (v28.16.1) é uma
biblioteca de componentes React — composites declarativos como `ListPage`,
`FormModal` e `DashboardPage` — e seus únicos executáveis são scripts de migração
(`pageshell-compat-check`, `pageshell-codemod-v18`). Não há gerador de projeto.
O repositório `parisgroup-ai/pg-starter`, citado no Módulo 1 como chassi da frota,
também não existe.

O objetivo descrito pela lição, porém, é legítimo e foi entregue aqui com as
mesmas bibliotecas que o próprio exemplo dela importa: `openapi-typescript` para
gerar os tipos e `openapi-fetch` para o cliente. O resultado é o prometido —
divergência de contrato aparece em tempo de compilação, não em runtime.

## O que ainda falta

O gate só roda quando alguém lembra de executá-lo. Enquanto não houver CI, um PR
pode chegar com contrato divergente sem ninguém perceber. Está registrado como
bloqueio #3 em `docs/handoff-sprint.md`.
