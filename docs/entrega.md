# Entrega — Lição 4 (Guiado)

## Repositório público

https://github.com/Joel-Cistrahenn/paris-group-copilot

Commit inicial: `b10371d feat: estrutura inicial Next.js com páginas Projeto e Hipótese`
Estrutura: Next.js 15 + TypeScript + Tailwind + App Router + src/ + alias `@/*`.

## Rotas funcionando em localhost:3000

```
$ curl -o /dev/null -w '%{http_code}' http://localhost:3000/projeto   -> 200
$ curl -o /dev/null -w '%{http_code}' http://localhost:3000/hipotese  -> 200

$ curl -s http://localhost:3000/projeto  | grep -oE '<h1>[^<]*</h1>|<p>[^<]*</p>'
<h1>Projeto</h1>
<p>Visão geral do projeto Paris Group Copilot.</p>

$ curl -s http://localhost:3000/hipotese | grep -oE '<h1>[^<]*</h1>|<p>[^<]*</p>'
<h1>Hipótese de Valor</h1>
<p>Enquadramento do problema e hipótese mensurável.</p>
```

Arquivos: `src/app/projeto/page.tsx` e `src/app/hipotese/page.tsx`.
`npx tsc --noEmit` passa sem erros.

O documento de enquadramento está em `docs/enquadramento.md`, referenciado no README.

---

# Enquadramento — Paris Group Copilot

## Contexto

A Marina é Product Manager num venture studio. O studio toca vários produtos ao
mesmo tempo, e ela participa da descoberta de todos eles.

O momento de uso é a sessão de discovery: ela está com stakeholders decidindo o
que construir, qual caminho seguir e qual tecnologia usar.

## Dor do Usuário

Não existe registro do que o studio já testou. Cada decisão é tomada de memória.

Quando a Marina considera uma abordagem que já foi testada e falhou meses atrás,
ela não tem como saber. Ela testa de novo.

Custo medido: **2 a 4 dias perdidos** cada vez que uma abordagem já descartada é
re-testada do zero.

O problema não é falta de ideias — é falta de registro.

## Hipótese de Valor

Se o Copilot mostrar as hipóteses já testadas pelo studio e o resultado de cada
uma, então a Marina não repetirá caminhos que já falharam, porque a decisão
passa a vir do histórico e não da memória dela.

## Métrica de Validação

Dias perdidos re-testando abordagens já descartadas.

- Baseline: 2 a 4 dias por ocorrência (medido hoje, sem o produto)
- Alvo: menos de 1 dia
- Como medir: acompanhar 5 sessões de discovery e registrar quantas decisões
  foram tomadas consultando histórico em vez de refazer o teste
- Critério de aceite: 4 das 5 sessões decidem sem repetir um teste anterior

## Fora de Escopo

1. **Login com Google.** A v1 usa email e senha. Autenticação social entra depois.
2. **Importar histórico de Notion/Jira.** Na v1 o cadastro de projeto e hipótese é
   manual. Conectores vêm quando houver histórico suficiente para valer a pena.
3. **Sugestão automática da IA.** A v1 apenas *busca* hipóteses parecidas e mostra
   o resultado de cada uma. A IA que sugere enquadramento fica para a v2 — sem
   registro acumulado, não há o que sugerir.
