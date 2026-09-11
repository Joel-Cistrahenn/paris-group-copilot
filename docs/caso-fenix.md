# Caso Fênix Studio — Copiloto de Agendamento

Caso de treino (persona, empresa e números fictícios).
Studio de healthtech, 3 produtos ativos, time compartilhado: 4 engenheiros, 2 PMs,
1 designer. Prazo: 6 semanas até MVP validável com 3 clínicas-piloto.

---

## 1. Enquadramento do Problema

**Público-alvo.** Clínicas de pequeno porte, sem time de TI, com agenda cheia e
recepção sobrecarregada.

**Problema central.** Ninguém confirma a consulta com o paciente antes do dia. A
clínica só descobre a falta quando o horário passa.

**Contexto de uso.** A recepção não tem gente para ligar paciente por paciente.
As soluções do mercado são caras e genéricas — feitas para redes, não para
clínicas de 2 a 5 salas.

**Consequência mensurável.** 30% das consultas agendadas viram falta. Cada falta
é uma cadeira ociosa que não vira receita e que não foi oferecida a quem estava
na fila de espera.

## 2. Hipótese de Valor

> **Se** o copiloto confirmar ativamente cada consulta por WhatsApp no dia
> anterior, **então** as clínicas-piloto vão reduzir a taxa de falta de 30% para
> 18% ou menos, **porque** o paciente que responde "não vou" libera o horário com
> antecedência suficiente para a recepção encaixar outro paciente.

**Métrica principal:** taxa de falta (no-show).
- Baseline: 30% das consultas agendadas (medido hoje, antes do produto)
- Alvo: ≤ 18% (redução de 40%)
- Como medir: comparar consultas agendadas x realizadas nas 3 clínicas

**Métrica secundária:** receita recuperada por clínica.
Não serve como juiz da hipótese — depende da recepção conseguir reocupar o
horário liberado, o que está fora do controle do produto. Serve como argumento
comercial.

**Critério de sucesso em 6 semanas:** 2 das 3 clínicas-piloto atingem taxa de
falta ≤ 18% em duas semanas consecutivas de operação.

## 3. Arquitetura de Stack Reutilizável

| Camada | Escolha | Por que, no contexto do studio |
|---|---|---|
| Frontend | Next.js (App Router) | mesmo framework dos 3 produtos ativos; o time compartilhado não troca de contexto ao mudar de produto |
| Backend | mesma base TypeScript do frontend | 4 engenheiros para 4 produtos — uma linguagem só é o que torna o rodízio possível |
| Dados | PostgreSQL | agenda é relacional (clínica → profissional → horário → paciente); o mesmo schema base serve outros produtos de agendamento do portfólio |
| IA | gateway centralizado de LLM com observabilidade | chave virtual e métrica por produto; custo de IA por venture fica visível desde o primeiro dia |
| Deploy | plataforma única com CI compartilhado | pipeline vem pronto do chassi; nenhum produto novo gasta semana montando deploy |
| Mensageria | WhatsApp Business API (provedor oficial) | **maior risco técnico — ver abaixo** |

### Maior risco técnico: WhatsApp

A API oficial exige aprovação da empresa, verificação do número e aprovação de
cada modelo de mensagem pela Meta. O prazo é externo e não negociável — pode
consumir semanas do cronograma de 6.

**Mitigação:** o pedido de aprovação é a **primeira tarefa da semana 1**, antes
de qualquer código de produto. Enquanto a aprovação não sai, o time desenvolve
contra um simulador de envio, e as 3 clínicas-piloto são escolhidas entre as que
já têm número comercial verificado.

Regra geral do studio: risco que não está sob seu controle entra primeiro no
cronograma, não por último.

## 4. Ciclo de Vida em 6 Semanas

| Semana | Etapa | Entregável mínimo |
|---|---|---|
| 1 | Descoberta | enquadramento + hipótese aprovados; baseline de falta medido nas 3 clínicas; pedido de aprovação WhatsApp protocolado |
| 2–3 | MVP | envio de confirmação no dia anterior e captura da resposta sim/não; agenda integrada |
| 3 | Instrumentação | eventos de mensagem enviada, respondida, consulta realizada e falta — planejados junto com o MVP, não depois |
| 4 | Qualidade do Modelo | critério de aceitação da leitura de resposta: em 50 respostas reais, 45 classificadas corretamente como confirmação ou cancelamento |
| 5–6 | Evolução | operação nas 3 clínicas, leitura semanal da taxa de falta, decisão de seguir ou refutar |

## 5. Fora de Escopo da v1

1. **Sugestão de horário alternativo.** O robô não reagenda. Ele avisa a recepção
   que o horário vagou.
2. **Detecção de padrão de cancelamento.** Precisa de histórico acumulado para
   treinar; em 6 semanas não existe volume suficiente. Entra na v2.

Na v1 o produto faz uma coisa só: pergunta se o paciente vem e registra a
resposta. É o mínimo que testa a hipótese — e a hipótese é sobre confirmação
ativa, não sobre inteligência preditiva.
