# Entrega — Lição 4 (Desafio)

## Repositório

https://github.com/Joel-Cistrahenn/paris-group-copilot

Monorepo: `src/` (Next.js) e `api/` (FastAPI), `docker-compose.yml` na raiz.

## docker compose up — serviços rodando

```
SERVICE   STATUS                        PORTS
api       Up About a minute             0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp
db        Up About a minute (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
```

## FastAPI respondendo — /docs acessível

```
GET http://localhost:8000/docs   -> HTTP 200 (Swagger UI)
GET http://localhost:8000/health -> {"status":"ok"}
```

## Contrato OpenAPI — endpoints e schemas

```
GET /health
GET /projetos
POST /projetos
POST /hipoteses
GET /hipoteses

schemas de request/response:
 - HTTPValidationError
 - HipoteseCreate
 - HipoteseOut
 - ProjetoCreate
 - ProjetoOut
 - ValidationError
```

Teste de ponta a ponta (POST /projetos e POST /hipoteses gravando no Postgres):

```json
[
    {
        "id": 1,
        "projeto_id": 1,
        "enunciado": "Se o Copilot mostrar hipoteses ja testadas, entao a Marina nao repetira caminhos que ja falharam, porque a decisao vem do historico.",
        "metrica": "Dias perdidos re-testando abordagens descartadas",
        "baseline": "2 a 4 dias por ocorrencia",
        "alvo": "menos de 1 dia",
        "resultado": "em_teste",
        "criado_em": "2026-09-11T19:29:07.551388Z"
    }
]
```

---

# Arquitetura — Paris Group Copilot

Cada decisão abaixo é justificada por três critérios do modelo de Venture Studio:
**(a)** velocidade de criação de MVPs, **(b)** reutilização entre produtos do
studio, **(c)** manutenção simples. Decisão que não move nenhum dos três não entra.

Regra que governa o documento: *complexidade só se paga com retorno medido*.

---

## 1. Frontend — Next.js (App Router), não Remix

**(a) Velocidade.** O studio cria vários MVPs por ano e quase todos precisam das
mesmas quatro coisas: página pública, área logada, rota de API e deploy. O App
Router entrega as quatro sem configuração. Remix resolve o mesmo problema com
qualidade equivalente, mas obrigaria o studio a manter duas culturas de
roteamento em paralelo enquanto os produtos antigos seguem em Next.

**(b) Reutilização.** Um design system só se paga quando é instalado sem adaptação
em todo produto novo. Componentes escritos para Server Components do Next não
migram de graça para o modelo de loaders do Remix — e componente que precisa de
port a cada produto deixa de ser ativo do studio e vira custo.

**(c) Manutenção.** Escolher o framework com maior base de uso reduz o tempo de
diagnóstico: erro de build já tem resposta escrita por outra pessoa. Num studio
com poucos desenvolvedores e muitos produtos, isso é decisivo.

**O que faria mudar:** se um produto exigir streaming de dados em cenário que o
App Router não cobre bem, ele é a exceção — não o novo padrão da frota.

## 2. Backend — FastAPI, não Express

⚠️ **Esta é a decisão que diverge do chassi da Paris Group.** Ver a seção 5.

**(a) Velocidade.** O contrato OpenAPI em `/docs` é gerado pelos próprios tipos
Pydantic, sem passo extra de build. Num MVP, o `/docs` funciona como primeira
interface utilizável do produto: dá para exercitar o fluxo de Projeto e Hipótese
antes de existir uma única tela.

**(b) Reutilização.** Os schemas Pydantic (`ProjetoCreate`, `HipoteseOut`) são
declarativos e portáveis entre produtos do studio — o mesmo par
"entidade + resultado registrado" reaparece em qualquer ferramenta de discovery.
Em Express seria preciso montar validação e documentação com bibliotecas
separadas, e cada produto montaria a sua combinação.

**(c) Manutenção.** Validação de entrada nasce junto do schema. Payload errado é
rejeitado com erro descritivo sem código de validação escrito à mão.

**Por que não Express:** não porque JavaScript seja pior, mas porque em Express o
contrato é convenção e não consequência. Contrato que depende de disciplina
humana degrada quando o mesmo time troca de produto toda semana.

## 3. Banco — PostgreSQL, não SQLite

**(a) Velocidade.** Subir Postgres por Docker Compose leva o mesmo tempo que
configurar SQLite, e evita a migração obrigatória no dia em que o MVP for pro ar.
Migrar banco durante validação custa dias que deveriam estar sendo gastos em
evidência.

**(b) Reutilização.** O mesmo `docker-compose.yml` serve qualquer produto novo do
studio sem edição. Ambiente local idêntico ao de produção significa que o
aprendizado de operação também acumula.

**(c) Manutenção.** SQLite não suporta escrita concorrente de verdade. O Copilot
é usado por várias pessoas na mesma sessão de discovery — é exatamente o caso em
que SQLite falha, e falha tarde.

**Modelagem.** `Hipotese` carrega `resultado` (`em_teste` / `validada` /
`refutada`) desde a primeira versão. Sem esse campo o produto não responde à
pergunta que justifica a existência dele: *"já testaram isso antes?"*.

## 4. Infraestrutura — Docker Compose

Um comando (`docker compose up`) sobe banco e API. Um desenvolvedor entra num
produto do studio e está rodando em minutos, sem instalar Postgres na máquina.
Mobilidade entre produtos é o que torna o time do studio mais barato que um time
por produto.

O `healthcheck` no serviço `db` existe porque a API sobe mais rápido que o
Postgres aceita conexão. Sem ele, o primeiro `up` falha de forma intermitente —
e falha intermitente no onboarding é o tipo de atrito que faz desenvolvedor
desconfiar da stack inteira.

---

## 5. Divergência declarada em relação ao chassi `pg-starter`

O padrão canônico da Paris Group é **100% TypeScript ponta a ponta**: Next.js +
tRPC + Drizzle + PostgreSQL, com `pnpm typecheck` como gate automático. Nesse
padrão, o tipo declarado no banco chega até o componente de UI sem tradução, e
OpenAPI é explicitamente tratado como **falso atalho** — porque uma camada
intermediária de contrato produz divergência silenciosa e alucinação de payload
quando agentes de IA escrevem o código.

Esta implementação usa FastAPI e OpenAPI porque o exercício exige. O custo real
dessa escolha, medido nos mesmos três critérios:

| Critério | Custo da divergência |
|---|---|
| (a) Velocidade | schema declarado duas vezes: Pydantic no backend, tipos no front |
| (b) Reutilização | componentes não herdam o tipo do banco; o ganho do chassi se perde |
| (c) Manutenção | nenhum gate automático cobre a fronteira entre os dois lados |

**Recomendação.** Para um produto real da frota, a camada `api/` seria
substituída por rotas tRPC dentro do próprio Next.js, com Drizzle no lugar do
SQLAlchemy. A modelagem de `Projeto` e `Hipotese` permanece idêntica — o que muda
é quem garante o contrato: o compilador, em vez de um documento.

Registrar a divergência aqui é parte do método. Um studio que documenta por que
saiu do padrão consegue voltar; um que sai sem registrar acumula dívida invisível.
