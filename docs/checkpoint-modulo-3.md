# Checkpoint — Módulo 3: Scaffolding e Estrutura do Produto

## Perguntas

### 1. O que é o PageShell e que problema resolve num Venture Studio

**Scaffolding** é a ferramenta que gera a estrutura inicial de um app Next.js +
React já com rotas, organização de pastas, TypeScript configurado e convenções de
componente prontas — eliminando as decisões repetitivas que existem antes da
primeira linha de lógica de negócio.

O problema que resolve no studio não é o tempo de setup, é a **divergência**. Sem
um ponto de partida padronizado, cada MVP nasce com decisões inconsistentes de
estrutura: um usa `src/`, outro não; um chama a pasta de `services`, outro de
`lib`; cada um resolve imports à sua maneira. Quando o mesmo time toca quatro
produtos, essa divergência cobra em dois lugares — onboarding (quem entra tem que
reaprender o mapa a cada projeto) e manutenção cruzada (componente de um produto
não encaixa no outro sem adaptação).

Scaffolding padronizado garante que Marina, Rafael e Camila abram qualquer produto
do portfólio e reconheçam imediatamente onde as coisas estão.

> **Ressalva factual.** Na frota real da Paris Group, o pacote
> `@parisgroup-ai/pageshell` (v28.16.1, no monorepo `parisgroup-ai/pg-platform`)
> **não é um gerador**: é uma biblioteca de componentes React com composites
> declarativos (`ListPage`, `FormModal`, `DashboardPage`, `WizardPage`,
> `KanbanBoard`) e adaptadores para Next.js. Seus únicos executáveis são scripts
> de migração (`pageshell-compat-check`, `pageshell-codemod-v18`). Não existe
> `pageshell init`, e o repositório `pg-starter` citado no Módulo 1 também não
> existe.
>
> A tese continua valendo, com um mecanismo melhor: gerador padroniza o **começo**
> e depois cada produto diverge; biblioteca mantém todos alinhados **para sempre**
> — corrigir um bug no `ListPage` corrige nos quatro produtos ao mesmo tempo.

### 2. Estrutura de diretórios e a responsabilidade de cada um

```
src/
  app/          rotas (App Router) — cada pasta é uma URL
  pages/        rotas (Pages Router) — espelhos, ver AGENTS.md
  components/   componentes reutilizáveis, sem acoplamento a rota
    layouts/    casca compartilhada: header, navegação
    projetos/   componentes de domínio
  lib/          lógica compartilhada e clientes
    api.ts      única porta de saída para o backend
    config.ts   leitura e validação de ambiente
  types/
    api.d.ts    GERADO do contrato OpenAPI — nunca editado à mão
  app/globals.css   estilos globais
api/            backend FastAPI (monorepo)
docs/           enquadramento, arquitetura, handoffs, CI
```

A separação que importa é **UI sem lógica de negócio**. `components/` recebe props
e renderiza; não sabe de onde os dados vêm. `lib/` sabe falar com o backend e não
sabe desenhar nada. `app/` é quem costura os dois.

Isso facilita manutenção e onboarding porque a pergunta "onde mexo?" tem resposta
única: mudou a aparência, `components/`; mudou a origem do dado, `lib/`; mudou a
URL, `app/`.

### 3. Componente de página x componente reutilizável

| | Componente de página | Componente reutilizável |
|---|---|---|
| Onde mora | `app/` ou `pages/` | `components/` |
| Ligado a uma rota | sim | não |
| Como recebe dado | busca (Server Component / `getServerSideProps`) | por props |
| Responsabilidade | orquestrar layout e dados | renderizar o que recebeu |

Exemplo do repositório: `src/app/projeto/page.tsx` chama `listarProjetos()` e
`listarHipoteses()`, decide o que fazer se a API cair, e entrega os dados prontos
para `<ProjectList projetos={...} hipoteses={...} />`. O `ProjectList` não sabe
que existe uma API — só sabe desenhar uma lista.

**Misturar os dois cria acoplamento desnecessário.** Um `ProjectList` que buscasse
os próprios dados não poderia ser reusado em outra tela com outra origem, não
poderia ser testado sem subir backend, e não poderia ser renderizado com dados de
exemplo. Foi exatamente isso que permitiu que as rotas `/projeto` (App Router) e
`/projects` (Pages Router) compartilhassem o mesmo componente sem duplicar uma
linha.

### 4. "Crio a estrutura na mão, é a mesma coisa"

Não é. **Estrutura manual depende de quem criou e do que essa pessoa lembrou
naquele dia.**

O scaffolding automatizado embute decisões que já foram testadas e que estão
documentadas implicitamente no próprio resultado — a pasta existe, então a
convenção existe. Feito à mão, a convenção mora na cabeça de uma pessoa, e some
quando ela troca de produto ou sai.

No contexto do studio o custo se multiplica de duas formas:

1. **Onboarding mais lento.** Sem convenção padronizada, cada projeto exige um
   tour guiado. Com quatro produtos, são quatro tours.
2. **Retrabalho de integração.** Quando o produto A organiza a camada de API em
   `services/` e o produto B em `lib/api/`, nenhum utilitário viaja entre eles sem
   ajuste. O aprendizado não acumula — é o oposto da tese do studio.

O argumento não é "dá menos trabalho". É que consistência entre produtos é o ativo
do studio, e consistência por disciplina humana não sobrevive ao quarto produto.

### 5. Onde o contrato OpenAPI aparece na estrutura

Em dois arquivos, e isso é proposital.

`src/types/api.d.ts` — **gerado** do `/openapi.json` que o FastAPI publica:

```bash
npm run gen:api   # openapi-typescript http://localhost:8000/openapi.json -o src/types/api.d.ts
```

`src/lib/api.ts` — a camada de cliente, única porta de saída para o backend:

```ts
import createClient from "openapi-fetch";
import type { components, paths } from "@/types/api";

export const api = createClient<paths>({ baseUrl: API_URL });

export type Projeto = components["schemas"]["ProjetoOut"];
export type Hipotese = components["schemas"]["HipoteseOut"];
export type NovaHipotese = components["schemas"]["HipoteseCreate"];
```

**Centralizar as chamadas num diretório específico permite atualizar o contrato
sem tocar em componente de UI.** Quando o backend muda, o `gen:api` regenera os
tipos e o `lib/api.ts` absorve a mudança; os componentes continuam recebendo as
mesmas props.

E resolve o erro mais comum de todos: `fetch` espalhado pelo código faz frontend e
backend divergirem sem ninguém ver. Cada chamada solta é um ponto onde o contrato
pode quebrar em silêncio.

No repositório isso foi **provado**, não afirmado. Renomeamos `metrica` para
`metrica_principal` em `api/schemas.py` de propósito:

```
$ npm run gen:api
$ npx tsc --noEmit
src/app/hipotese/form.tsx(21,7): error TS2353: Object literal may only specify
known properties, and 'metrica' does not exist in type '{ ...
metrica_principal: string; ... }'.
```

Divergência de contrato virou erro de compilação. Com `fetch` espalhado, teria
virado campo vazio em produção.

### 6. Os três primeiros passos para adaptar ao domínio

**1. Rotas alinhadas ao domínio.** O scaffolding vem com rotas genéricas. O
Copilot precisa das rotas das suas entidades: `/projeto`, `/projeto/[id]` e
`/hipotese`. Rota é a primeira declaração do que o produto faz — antes de existir
componente, a URL já diz o modelo mental.

**2. Componentes de domínio dentro da estrutura gerada.** `ProjectCard`,
`ProjectList`, e mais tarde `HipoteseCard`. Ficam em `components/projetos/`, não
soltos na raiz de `components/` — agrupar por domínio é o que permite achar tudo
de um assunto num lugar quando o produto cresce.

**3. Registrar as decisões de adaptação.** Toda mudança sobre o scaffolding base
vai para `AGENTS.md` e para `docs/arquitetura.md`, com a justificativa. Neste
repositório isso cobriu três divergências: o backend em FastAPI em vez de tRPC, a
existência de `src/pages/` ao lado do App Router, e o uso de `openapi-typescript`
no lugar do gerador citado pelo curso.

Rastreabilidade sobre o scaffolding é o que separa "customizamos" de "fugimos do
padrão sem querer". Divergência declarada volta atrás; divergência silenciosa vira
dívida invisível.

---

## Reflexão

### Tempo gasto em estrutura antes da primeira linha de lógica

No Conecta Primo AI — produto próprio, um ano de construção — a estrutura foi
decidida em cima da hora e cresceu por acréscimo: backend Flask em Python,
frontend em HTML e JS puro, Firestore, app Android em Kotlin, deploy dividido
entre Render e Vercel. Nenhuma dessas escolhas foi errada isoladamente. Juntas,
elas produziram um produto onde **não existe nenhum gate automático**: não há
`typecheck`, não há contrato, não há CI.

O que um scaffolding padronizado mudaria: as quatro ou cinco horas iniciais de
setup, sim — mas principalmente teria imposto um contrato desde o primeiro dia.

O que ele **não** resolveria e continuaria sendo decisão manual: o modelo de
domínio, quais entidades existem, o que é obrigatório em cada uma, e a hipótese de
valor que justifica cada tela. Scaffolding entrega a casca. O produto continua
sendo o trabalho.

### Quando eu discordaria de uma opinião embutida

Já aconteceu duas vezes neste repositório, e as duas estão documentadas.

**Discordei do gerador.** O curso manda usar `pageshell init`, que não existe. O
objetivo — cliente tipado a partir do contrato OpenAPI — foi entregue com
`openapi-typescript` e `openapi-fetch`, as mesmas bibliotecas que o exemplo da
própria lição importa. Registrado em `docs/contrato-tipado.md`.

**Discordei do roteador.** O exercício pede Pages Router; o projeto nasceu em App
Router por instrução do Módulo 1 e porque é o padrão da frota. Em vez de migrar —
o que seria regredir a arquitetura para satisfazer um enunciado — os dois
roteadores convivem, com o App Router canônico e `src/pages/projects/` como
espelho que reusa os mesmos componentes. Registrado em `AGENTS.md`, com a
instrução explícita de não tratar `src/pages/` como padrão do projeto.

Como documentar: no `AGENTS.md` fica a regra operacional (o que fazer daqui pra
frente), em `docs/arquitetura.md` fica o custo da divergência nos três critérios
do studio, e no corpo da Pull Request fica a seção "Integridade de contratos".
Divergência que aparece nos três lugares não pega ninguém de surpresa.

### Três tipos de usuário com fluxos distintos

**O que eu mudaria agora, porque fica caro depois:**

A camada de dados. Hoje `lib/api.ts` expõe `listarProjetos()` e
`listarHipoteses()` sem noção de quem está pedindo. Com três perfis, cada um vê um
recorte diferente do mesmo dado — o líder de inovação quer o portfólio inteiro, o
PM quer os projetos dele, o engenheiro quer as hipóteses em teste. Introduzir
filtro por perfil depois significa mexer em toda chamada existente; introduzir
agora custa um parâmetro.

Junto disso, o `AppLayout` já aceita `titulo` e `descricao` como props em vez de
ter conteúdo fixo — isso já o deixa pronto para navegação variável por perfil sem
reescrita.

**O que eu deixaria para depois:**

Telas separadas por perfil, permissões granulares e qualquer forma de
personalização. Motivo: não existe nenhum usuário ainda. Construir três fluxos
distintos antes de saber se **um** resolve é multiplicar por três uma hipótese não
validada.

O critério é o mesmo que cortou a IA da v1: **o que é caro de mudar depois, decide
agora; o que é barato de mudar depois, espera evidência.** Formato de dado é caro.
Tela é barata.
