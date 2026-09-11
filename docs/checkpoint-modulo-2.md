# Checkpoint — Módulo 2: Colaboração com IA e Ferramentas

## Perguntas de Compreensão

### 1. Pair programming com IA em ciclos curtos — papéis do humano e do agente

O que caracteriza o modelo é o **tamanho do ciclo**, não a divisão de trabalho. Um
ciclo é: planejar → implementar → revisar → iterar. Cada volta tem escopo
definido, entrega verificável e um ponto de decisão antes de seguir.

**O humano** define o objetivo e os critérios de aceitação, mantém o contexto do
produto e revisa o resultado. É ele quem valida se o output do agente está dentro
da política e da qualidade esperadas — e é ele quem decide seguir ou refazer.

**O agente** implementa e sugere. Pergunta o que está ambíguo, mostra evidência de
que funciona, e não ocupa o lugar de quem decide.

O que quebra o modelo é o ciclo esticar. Quando o agente escreve por muito tempo
sem checkpoint, o humano deixa de decidir e vira passageiro — o resultado continua
saindo, mas ninguém mais sabe se está certo.

### 2. Passos mínimos para validar ambiente e travar governança

```bash
pg-devkit doctor                # diagnostica host, plugins, CLI e estado do baseline
workflow-policy.sh set-mode pr  # trava commit e push direto na main
workflow-policy.sh get-mode     # confirma: deve responder "pr"
```

Junto disso, a camada de contexto persistente: os arquivos `AGENTS.md` e
`CLAUDE.md` na raiz do repositório declaram arquitetura, convenções e restrições.
É o que permite o agente ter contexto entre sessões sem alguém repetir instrução
manualmente — e é o que impede uma sessão nova de redescobrir tudo do zero.

Com o modo `pr` ativo, nenhuma entrega chega na `main` sem branch dedicada e Pull
Request. Não é convenção de time: é trava local.

### 3. TaskNotes CLI x GitHub Issues — quando cada um agrega

Não são concorrentes. Registram coisas diferentes:

| | GitHub Issues | TaskNotes (`tn`) |
|---|---|---|
| Público | o time e quem olha de fora | o indivíduo |
| Registra | o **acordado** com o time | o **andamento** do trabalho |
| Onde vive | na nuvem, colaborativo | local, no vault |
| Extras | discussão, labels, milestone | `tn start`, `tn pomo`, `tn log`, tempo por tarefa |

O argumento para o colega: Issues é orientado a colaboração e rastreamento
público — ele sabe se algo está aberto ou fechado. O TaskNotes é orientado ao
fluxo individual de execução: ele sabe quanto tempo a tarefa consumiu, quantas
sessões foram necessárias e qual era o contexto ativo quando o trabalho parou.

Nenhuma Issue responde "para onde foi meu dia". É essa a lacuna.

Os dois juntos: **Issue registra o combinado, TaskNote registra o percorrido.**

### 4. Elementos mínimos de um handoff no padrão Orca

Quatro, e nenhum é opcional:

1. **Contexto** — o que foi feito, quais decisões foram tomadas e **por quê**. A
   justificativa importa mais que a lista: sem ela, quem continua refaz a análise.
2. **Estado atual** — o que está funcionando, o que está pendente, quais bloqueios
   são conhecidos.
3. **Bloqueios com owner** — bloqueio sem dono nomeado não é bloqueio, é desabafo.
4. **Próximos passos concretos com critérios de aceitação** — cada item com
   responsável, estimativa e o que conta como pronto.

O teste de qualidade é simples: outro membro do time — ou você mesmo no dia
seguinte — consegue continuar **sem fazer nenhuma pergunta**. Se precisou
perguntar, o handoff falhou.

### 5. O erro mais comum ao especificar um prompt

Prompt vago: sem exemplo de entrada e saída esperadas, sem limites de
comportamento e sem condição de sucesso.

"Melhora essa função" não pode ser aprovado nem reprovado. O agente entrega
alguma coisa, e o humano não tem como saber se aquilo é o certo — descobre tarde,
em produção.

**Critérios de aceitação tornam o resultado verificável:** o agente sabe quando
parar e o humano sabe como validar. **Exemplos concretos reduzem ambiguidade** e
tornam o output previsível e testável.

Exemplo real deste módulo — a `FEAT-001` foi especificada antes do código:

```
- Nenhum `any`; o tipo do payload é declarado e reutilizado
- npx tsc --noEmit passa com 0 erros
- API indisponível não quebra a página: mostra mensagem, não stack trace
```

Foi por causa desses critérios que o tratamento de erro proposto pôde ser
**rejeitado** na revisão. Sem critério escrito, a proposta teria passado — não
haveria régua para reprová-la.

### 6. Para que serve o PR template padronizado

Para que cada Pull Request carregue contexto suficiente para ser revisado **sem
reunião**: o que mudou, por quê, e como testar.

Seções mínimas:

| Seção | O que responde |
|---|---|
| Contexto | o que mudou no código e a justificativa técnica |
| Evidência | saída real dos comandos de verificação — não a promessa de que rodaram |
| Como testar | passos reproduzíveis, incluindo o caminho de falha |
| Rastreabilidade | Issue do GitHub ou TaskNote (`CHORE-NNN`) relacionado |
| Integridade de contratos | alinhamento com o chassi, ou divergência declarada |

Num venture studio que opera com IA, duas informações extras importam: **se o
código foi gerado por agente** e **qual critério de aceitação foi aplicado**. Sem
isso, o revisor não sabe se está lendo uma decisão humana ou uma sugestão que
passou sem avaliação.

---

## Reflexão

### Onde o pair programming economizou mais tempo

Na **implementação**, com folga — scaffolding, encanamento e código repetitivo
saíram em minutos. Mas essa é a resposta óbvia, e ela esconde a mais importante.

O tempo que realmente mudou de escala foi o da **revisão**, e no sentido inverso:
ela passou a consumir a maior parte da atenção. E deve mesmo. Quando construir
fica barato, o gargalo deixa de ser escrever e passa a ser decidir o que vale
manter.

O que isso muda na estrutura das sessões: o planejamento precisa render um
critério de aceitação escrito **antes** do primeiro prompt, e cada ciclo precisa
terminar em revisão humana antes do próximo. Sessão sem critério prévio não
economiza tempo — ela transfere o custo para depois, quando o erro já está no
código.

### O que bastaria para integrar alguém hoje

Suficiente:

- `AGENTS.md` — estrutura, convenções, divergência de stack declarada e comandos
  de verificação.
- `README.md` — como subir o ambiente, URLs de cada serviço, índice dos documentos.
- `.github/pull_request_template.md` — o formato esperado de qualquer entrega.
- `docs/enquadramento.md` — o contrato intelectual: toda feature precisa ser
  justificável por ele.
- `docs/handoff-sprint.md` — estado atual, decisões, bloqueios com dono.

Ainda faltaria:

- **CI configurado.** Hoje o `typecheck` é gate por disciplina, não por
  automação. Alguém novo pode abrir PR sem rodar nada.
- **Testes.** Não há suíte; a verificação é manual e depende de lembrar dos
  comandos.
- **Acesso e credenciais.** O que precisa ser provisionado para alguém rodar o
  projeto não está documentado em lugar nenhum.

### Código que passa nos testes mas foge da arquitetura

Teste verde prova que o código **funciona**. Não prova que ele **pertence** ali.
São perguntas diferentes, e nenhuma suíte responde a segunda.

O que resolve o conflito antes do merge, em três camadas:

1. **`AGENTS.md`** declara o padrão explicitamente. Sem regra escrita, a discussão
   vira preferência pessoal e quem fala mais alto ganha.
2. **Critérios de aceitação no prompt** já incluem aderência à arquitetura — não
   só "passa nos testes". Um critério do tipo *"sem `any`; o tipo do payload é
   declarado e reutilizado"* reprova código que funciona mas contraria o padrão.
3. **PR template com a seção de integridade de contratos** obriga a declarar
   alinhamento ou divergência. O revisor lê a declaração, não precisa deduzir.

E o desfecho aceito não é sempre "refaz". Divergência **declarada**, com o custo
registrado — como está em `docs/arquitetura.md`, seção 5 — é decisão legítima.
O que não se admite é divergência silenciosa: essa entra no chassi e contamina
todo produto que herdar a stack depois.
