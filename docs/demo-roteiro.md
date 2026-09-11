# Roteiro da demo — Loom, 3 minutos

Atualização assíncrona de sprint para os investidores. Gravar com a tela em
`localhost:3000` e a API no ar (`docker compose up -d`).

Regra da Paris Group: 2 a 3 minutos. Demo longa perde tração.

---

## 0:00 – 0:35 · Contexto de negócio

*(tela: `/projeto`)*

> "O Paris Group Copilot resolve um problema específico de studio: a equipe testa
> hipóteses em vários produtos e não fica registro nenhum do que já foi testado.
> O resultado é que a mesma abordagem que falhou há seis meses é testada de novo —
> custa de 2 a 4 dias cada vez que isso acontece.
>
> O produto é um registro de projetos e hipóteses onde cada hipótese guarda o
> resultado: em teste, validada ou refutada. É esse campo que responde
> 'já testaram isso antes?'."

## 0:35 – 1:30 · Demonstração do fluxo

*(navegar: `/projeto` → clicar em "Cadastrar hipótese" → `/hipotese`)*

> "Aqui está a listagem de projetos, com a contagem de hipóteses de cada um —
> tudo vindo do Postgres pela API.
>
> No cadastro, repare nos campos obrigatórios: enunciado no formato causal,
> métrica, **baseline** e **alvo**. Baseline é o número de hoje, antes do produto.
> Sem ele a hipótese não pode ser aprovada nem refutada, então o sistema não
> deixa salvar. A regra de produto virou trava técnica."

*(preencher e enviar uma hipótese → voltar para `/projeto` e mostrar a contagem subindo)*

## 1:30 – 2:15 · Contexto técnico

*(tela: `localhost:8000/docs`)*

> "O backend expõe o contrato OpenAPI gerado automaticamente — dá para exercitar
> Projeto e Hipótese aqui sem passar por tela nenhuma.
>
> Três decisões desta sprint:
> primeira, o campo `resultado` entrou na modelagem desde o primeiro dia, porque
> sem ele o produto não tem razão de existir.
> Segunda, a IA foi cortada da v1 — sem histórico acumulado não há o que sugerir.
> Terceira, falha de API mostra mensagem ao usuário e registra a causa no log,
> as duas coisas."

*(mostrar rapidamente `docs/arquitetura.md` na seção 5)*

> "E a divergência de stack está declarada, não escondida: este repositório usa
> FastAPI enquanto o chassi da casa é TypeScript ponta a ponta. O custo está
> documentado."

## 2:15 – 3:00 · Bloqueios e próximos passos

> "Dois bloqueios ativos.
>
> O primeiro é de produto e é o mais crítico: falta definir se a v1 inclui a busca
> por hipóteses parecidas. Sem essa definição não há o que instrumentar, e sem
> instrumentação a hipótese principal não pode ser validada. Dono: produto,
> resolução esperada em uma semana.
>
> O segundo é técnico: decidir se o backend migra para o chassi TypeScript.
> Gera dívida conhecida, mas não trava ninguém. Dono: lead técnico, duas semanas.
>
> Próximo passo imediato é instrumentar os eventos de cadastro e consulta,
> assim que o escopo da v1 for definido. Detalhes no handoff linkado na descrição."

---

## Checklist antes de gravar

- [ ] `docker compose up -d` rodando (API e Postgres no ar)
- [ ] `npm run dev` rodando
- [ ] Um projeto já cadastrado, para a tela não abrir vazia
- [ ] Abas abertas na ordem: `/projeto`, `/hipotese`, `localhost:8000/docs`
- [ ] Cronômetro: cortar em 3 minutos

## Depois de gravar

Colar o link em dois lugares — é o requisito de rastreabilidade:

1. `docs/handoff-sprint.md`, seção "Demo"
2. Descrição desta Pull Request

---

## Gravação final

🎥 https://drive.google.com/file/d/1c5Kgl_uILzVsVNmtHQKWKmeE0n2iyqK2/view?usp=sharing

Duração: 2m27s. Editada a partir de 7m05s de gravação bruta — cortados os
retakes, o silêncio morto e as pausas longas.
