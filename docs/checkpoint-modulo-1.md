# Checkpoint — Módulo 1: Fundamentos de Studio, Produto e Stack

## Perguntas de Compreensão

### 1. Venture Studio x aceleradora/incubadora

A aceleradora e a incubadora entram **de fora**: investem, mentoram, abrem porta —
mas quem constrói é o time da startup. O venture studio entra **de dentro**: ele é
co-fundador e co-construtor. O time do studio é o time que escreve o código.

A consequência prática é que reutilização de time, processo e tecnologia deixa de
ser acidental e vira estrutural. Numa aceleradora, cada portfolio company escolhe
sua stack e o aprendizado morre ali dentro. Num studio, o mesmo engenheiro entra
em quatro produtos no mesmo ano.

Isso muda o critério de decisão de stack: a pergunta não é "qual a melhor
tecnologia para este produto?", e sim "qual tecnologia serve os próximos quatro
produtos que ainda não existem?". Decisão local ótima que não se repete é, no
studio, decisão ruim.

### 2. Etapas do ciclo de vida e critério de conclusão do MVP

As cinco etapas: **descoberta → MVP → instrumentação → qualidade do modelo →
evolução baseada em dados**.

O MVP está concluído quando a **hipótese de valor principal se tornou testável** —
não quando o produto está completo. São coisas diferentes, e confundir as duas é o
que faz produto ficar anos sem lançar.

Instrumentação e qualidade do modelo são etapas **distintas** do MVP, não partes
dele. O MVP produz o comportamento; a instrumentação torna esse comportamento
observável; a qualidade do modelo define quando a resposta da IA é aceitável.

### 3. Hipótese de valor para um produto fictício de IA

Produto: triagem automática de tickets de suporte numa empresa de software.

> **Se** o sistema classificar cada ticket recebido em uma de cinco filas
> (cobrança, bug, dúvida de uso, acesso, outros) no momento da entrada,
> **então** os analistas de suporte de primeiro nível vão reduzir o tempo médio
> de primeira resposta de 4h para menos de 1h, **porque** deixam de ler e rotear
> ticket manualmente antes de começar a resolver.

- **Problema:** tickets chegam sem classificação e são roteados à mão.
- **Público:** analistas de suporte de primeiro nível.
- **Mecanismo de IA:** classificação em cinco categorias fixas — não "usar IA para
  melhorar o suporte".
- **Métrica de validação:** tempo médio de primeira resposta, baseline 4h, alvo
  < 1h, medido sobre 200 tickets, aprovado se a mediana ficar abaixo de 1h.

### 4. Risco de não definir o contrato de API antes do frontend

Sem contrato, frontend e backend **divergem em silêncio**. Ninguém erra de forma
visível: o backend renomeia um campo, o frontend continua lendo o nome antigo e
recebe `undefined`. O bug não aparece no build — aparece em produção, com usuário
na frente, e o rastro é difícil de seguir porque nada quebrou explicitamente.

No contexto de studio, o custo se multiplica. O componente escrito sem contrato é
reaproveitado no produto seguinte, e a inconsistência é herdada junto. O que era
um bug em um produto vira um padrão errado na frota.

Por isso ignorar o contrato é risco de **arquitetura**, não de organização.

Observação relevante ao chassi da Paris Group: o contrato não precisa ser um
arquivo OpenAPI. Em stack full-TypeScript com tRPC e Drizzle, o contrato é o
próprio sistema de tipos, e `pnpm typecheck` é o gate que impede a divergência.
O erro não é escolher OpenAPI ou tipos — é não ter contrato nenhum.

### 5. As cinco camadas e por que dados e IA não podem ser ignorados

As camadas a padronizar: **frontend, backend, dados, IA e deploy**.

A camada de IA precisa de pelo menos uma decisão de padronização já no MVP — qual
provedor de LLM, como os prompts são versionados, por onde passam as chamadas.
Sem isso, não existe ponto único onde medir custo, latência e qualidade.

Ignorar dados e IA no MVP significa chegar na etapa de qualidade do modelo **sem
baseline**. Não haverá com o que comparar: nenhum registro de como o modelo se
comportava antes, nenhum histórico de resposta, nenhum custo por chamada. A etapa
seguinte do ciclo fica impossível de executar, não apenas difícil.

Foi por isso que, no enquadramento do Paris Group Copilot, a camada de dados veio
primeiro: sem registro acumulado de hipóteses e resultados, não existe o que a IA
sugira na v2.

### 6. Por que "colocar IA em tudo" é erro crítico

Porque cada feature de IA sem hipótese de valor mensurável não tem como ser
julgada. Não se sabe se ela gera valor ou apenas complexidade — e na dúvida, ela
fica, acumulando custo.

Cada integração de IA sem critério de aceitação definido aumenta a superfície de
falha: alucinação, timeout, resposta fora de política. Sem critério, essas falhas
não são diagnosticáveis — não dá para saber se o problema foi o produto, o prompt
ou o modelo.

E no modelo de studio o custo de manutenção se multiplica entre produtos. IA
desnecessária num MVP não fica contida naquele MVP: ela entra no chassi e vira
dívida técnica em todo produto que herda a stack depois.

Capacidade técnica para implementar não é justificativa. "Conseguimos fazer" nunca
foi o mesmo que "vale a pena fazer".

---

## Reflexão

### Um produto que conheço bem

O Conecta Primo AI — plataforma que reúne vários modelos de IA num lugar só, com
acesso por Telegram e importação do histórico de outras plataformas.

Enquadrado como hipótese testável:

> **Se** o produto entregar IA multi-modelo dentro do Telegram com o histórico
> importado, **então** quem hoje alterna entre vários apps de IA vai usar a
> ferramenta em pelo menos 4 dias da segunda semana, **porque** não precisa trocar
> de app nem recomeçar do zero.

**Métrica mais honesta:** uso recorrente na **segunda** semana — não na primeira.
A primeira semana mede curiosidade; a segunda mede hábito.

**O que tornaria a hipótese falsa:** os usuários convidados experimentarem na
semana 1 e não voltarem na semana 2. Nesse caso a dor de "trocar de app" não é
grande o suficiente para sustentar o produto, e a aposta teria que mudar para o
que o concorrente não consegue fazer — a IA agindo dentro das ferramentas do
usuário (GitHub, Drive), que é impotência, não incômodo.

### Qual camada padronizar primeiro

**Dados.** É a camada que não dá para recuperar depois.

Frontend pode ser refeito em uma semana. Deploy pode ser trocado. Mas o registro
que não foi guardado nas primeiras semanas está perdido para sempre — e sem ele
não existe baseline, não existe instrumentação e não existe a etapa de qualidade
do modelo.

**O que eu sacrificaria para manter o MVP mínimo:** a própria IA. No Copilot, a v1
apenas busca hipóteses parecidas e mostra o resultado de cada uma; a sugestão
automática fica para a v2. Sem registro acumulado, não há o que sugerir — a IA
seria demonstração, não valor.

### Riscos da reutilização quando as hipóteses são muito diferentes

O risco central é o chassi virar camisa de força. Um produto com hipótese de
latência baixa e outro com hipótese de profundidade analítica pedem decisões
opostas na camada de IA; forçar os dois no mesmo padrão faz um deles nascer ruim.

O segundo risco é mais silencioso: componente compartilhado acumula condicional
para atender casos que só existem em um produto. Ele deixa de ser reutilizável e
vira dependência que ninguém quer tocar.

O ciclo de vida gerencia esse risco porque **a hipótese vem antes da stack**. Na
etapa de descoberta fica claro se o novo produto cabe no chassi ou se precisa
divergir — e a divergência, quando acontece, é registrada com o custo declarado
(como feito em `docs/arquitetura.md`). Studio que documenta por que saiu do padrão
consegue voltar. Studio que sai sem registrar acumula dívida invisível.
