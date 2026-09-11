# Entrega — Módulo 3, Lição 3

Repositório: https://github.com/Joel-Cistrahenn/paris-group-copilot
PRs: #4 (cliente tipado do OpenAPI) e #5 (layout, componentes e config)

---

## Nota sobre o material: PageShell e Pages Router

Duas instruções do exercício não são executáveis como escritas, e isso está
declarado em vez de contornado em silêncio.

**1. `pageshell init` não existe.** O pacote `@parisgroup-ai/pageshell` (v28.16.1,
no monorepo `parisgroup-ai/pg-platform`) é uma **biblioteca de componentes React** —
composites declarativos como `ListPage`, `FormModal`, `DashboardPage`, `WizardPage`
e `KanbanBoard`. Seus únicos executáveis são scripts de migração:
`pageshell-compat-check`, `pageshell-upgrade-flow`, `pageshell-codemod-v18`,
`pageshell-codemod-v7-pagetabs`. Não há gerador de projeto em nenhum pacote do
monorepo. O repositório `parisgroup-ai/pg-starter`, citado no Módulo 1 como chassi
da frota, também não existe.

**2. O exercício pede Pages Router, o projeto usa App Router.** O Módulo 1, Lição 4
mandou criar o projeto com `create-next-app --app`, e o App Router é o padrão da
frota. Migrar para Pages Router seria regredir a arquitetura para satisfazer um
enunciado. A equivalência:

| Pedido no exercício | Equivalente no App Router |
|---|---|
| `pages/_app.tsx` | `src/app/layout.tsx` + `AppLayout` |
| `pages/index.tsx` | `src/app/page.tsx` |
| `pages/projects/index.tsx` | `src/app/projeto/page.tsx` |
| `pages/projects/[id].tsx` | `src/app/projeto/[id]/page.tsx` |
| `lib/api/client.ts` | `src/lib/api.ts` |
| `lib/config.ts` | `src/lib/config.ts` |

O **objetivo** de cada nível foi entregue integralmente. Só o mecanismo mudou.

---

## Nível Guiado — estrutura e ambiente

### Estrutura de pastas

```
src/
  app/
    layout.tsx                 # layout raiz
    page.tsx                   # rota /
    projeto/
      page.tsx                 # rota /projeto
      [id]/page.tsx            # rota /projeto/:id
    hipotese/
      page.tsx                 # rota /hipotese
      form.tsx                 # client component do formulário
  components/
    layouts/AppLayout.tsx      # header + navegação compartilhados
    projetos/ProjectCard.tsx   # componente de domínio
    projetos/ProjectList.tsx   # componente de domínio
  lib/
    api.ts                     # cliente tipado (openapi-fetch)
    config.ts                  # configuração validada no boot
  types/
    api.d.ts                   # GERADO do contrato OpenAPI
api/                           # backend FastAPI (monorepo)
```

Separação clara entre rotas (`app/`), componentes (`components/`) e
cliente/utilitários (`lib/`).

### Servidor sobe e rotas respondem

```
$ npm run dev
▲ Next.js 15 — ready on http://localhost:3000

$ curl -o /dev/null -w '%{http_code}' localhost:3000/projeto      -> 200
$ curl -o /dev/null -w '%{http_code}' localhost:3000/projeto/1    -> 200
$ curl -o /dev/null -w '%{http_code}' localhost:3000/projeto/999  -> 404
$ curl -o /dev/null -w '%{http_code}' localhost:3000/hipotese     -> 200
```

Nenhum erro 500. A `/projeto/999` retorna 404 porque `notFound()` é chamado
quando o id não existe — comportamento correto, não falha.

### `.env.local.example`

```
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_URL=postgresql://copilot:copilot@localhost:5432/copilot
REDIS_URL=redis://localhost:6379
```

---

## Nível Semi-guiado — componentes tipados e consumo da API

### `ProjectCard` com props tipadas

```tsx
export interface ProjectCardProps {
  projeto: Projeto;
  totalHipoteses: number;
  validadas: number;
}
```

Exibe nome, descrição, status (`n/m validadas`) e data de criação formatada.

### `ProjectList` com props tipadas

```tsx
export interface ProjectListProps {
  projetos: Projeto[];
  hipoteses: Hipotese[];
  vazio?: string;
}
```

Renderiza um `ProjectCard` por projeto, cruzando as hipóteses para calcular o
progresso de cada um. Trata o estado vazio.

### Cliente gerado do contrato OpenAPI — não `fetch` sem tipo

`src/types/api.d.ts` é **gerado** do `/openapi.json` do FastAPI:

```bash
npm run gen:api   # openapi-typescript http://localhost:8000/openapi.json -o src/types/api.d.ts
```

`src/lib/api.ts` usa `openapi-fetch` tipado por ele:

```ts
import createClient from "openapi-fetch";
import type { components, paths } from "@/types/api";

export const api = createClient<paths>({ baseUrl: API_URL });

export type Projeto = components["schemas"]["ProjetoOut"];
export type Hipotese = components["schemas"]["HipoteseOut"];
export type NovaHipotese = components["schemas"]["HipoteseCreate"];
```

Nenhum tipo de domínio é escrito à mão no frontend. A fonte da verdade é o schema
Pydantic do backend.

**Prova de que o contrato é real:** renomeamos `metrica` para `metrica_principal`
em `api/schemas.py`, reconstruímos a API e regeneramos os tipos.

```
$ npx tsc --noEmit
src/app/hipotese/form.tsx(21,7): error TS2353: Object literal may only specify
known properties, and 'metrica' does not exist in type '{ projeto_id: number;
enunciado: string; metrica_principal: string; baseline: string; alvo: string;
resultado: "em_teste" | "validada" | "refutada"; }'.
```

Divergência de contrato virou erro de compilação. Revertido em seguida.

### Sem `any`

```
$ grep -rn ": any\|<any>\|as any" src --include="*.ts" --include="*.tsx" | grep -v types/api.d.ts
(nenhuma ocorrência)

$ npx tsc --noEmit   -> 0 erros
$ npx eslint src     -> 0 erros
```

---

## Nível Desafio — layout, ambientes e validação de config

### Requisito 1 — rotas com layout compartilhado

`src/components/layouts/AppLayout.tsx` concentra header e navegação:

```tsx
export interface AppLayoutProps {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}
```

Usado por `/projeto`, `/projeto/[id]` e `/hipotese`. Nenhuma das três duplica
código de navegação — cada uma passa apenas título, descrição e conteúdo.

```
# ocorrências do header em cada rota:
/projeto     -> 1
/projeto/1   -> 1
/hipotese    -> 1
```

**Restrição respeitada:** composição pura de componentes React. Sem Redux, sem
Zustand, sem Context API para estado de servidor. Os dados vêm de Server
Components chamando a API diretamente.

### Requisito 2 — variáveis separadas por ambiente

```
$ git check-ignore .env.local              -> ignorado
$ git check-ignore .env.local.example      -> versionado
$ git check-ignore .env.production.example -> versionado
```

O `.gitignore` do `create-next-app` traz `.env*`, que engolia também os arquivos
de exemplo. Foram adicionadas negações explícitas:

```
!.env.local.example
!.env.production.example
```

`.env.production.example` documenta as três obrigatórias **sem valores reais**:

```
NEXT_PUBLIC_API_URL=
DATABASE_URL=
REDIS_URL=
```

### Requisito 3 — validação de configuração na inicialização

`src/lib/config.ts` roda de forma **síncrona na importação**, antes do primeiro
render:

```ts
function ler(nome, producao: boolean): string {
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

export const config: Config = carregar();
```

Em produção, variável ausente derruba o boot com erro que diz **qual** variável
falta, **quais** são todas as obrigatórias e **onde** ver o formato. Em
desenvolvimento, usa fallback e avisa no console.

O raciocínio: falhar no boot é melhor que falhar no primeiro pedido do usuário.
Um erro de configuração que só aparece em runtime vira incidente; o mesmo erro no
deploy vira rollback automático.

---

## Estrutura final

```
src/app/hipotese/form.tsx
src/app/hipotese/page.tsx
src/app/layout.tsx
src/app/page.tsx
src/app/projeto/[id]/page.tsx
src/app/projeto/page.tsx
src/components/layouts/AppLayout.tsx
src/components/projetos/ProjectCard.tsx
src/components/projetos/ProjectList.tsx
src/lib/api.ts
src/lib/config.ts
src/types/api.d.ts
```
