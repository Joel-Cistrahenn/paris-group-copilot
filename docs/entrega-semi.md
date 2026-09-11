# Entrega — Lição 4 (Semi-guiado)

Repositório: https://github.com/Joel-Cistrahenn/paris-group-copilot
Documento: `docs/enquadramento.md`, referenciado no `README.md` na seção "Documentação".
Commits: `b10371d` (estrutura inicial) e `docs: entrega da lição 4`.

As 5 seções pedidas estão preenchidas abaixo, incluindo Fora de Escopo com 3 itens
(o mínimo pedido era 2).

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
