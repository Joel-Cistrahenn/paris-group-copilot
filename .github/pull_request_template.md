## Contexto

<!-- O que mudou no código e qual a justificativa técnica. Se a mudança nasceu de
     uma hipótese de valor, cite qual. -->

## Evidência

<!-- Prova tangível de validação. Cole a saída real dos comandos, não a promessa
     de que rodaram.

     npx tsc --noEmit      -> 0 erros
     docker compose ps     -> serviços up
     curl localhost:8000/health
-->

## Rastreabilidade

<!-- Referência explícita à Issue no GitHub ou ao TaskNote (CHORE-NNN) no PG-Vault. -->

## Integridade de contratos

<!-- Confirme o alinhamento com o chassi Full-TS da organização.
     Se este PR diverge do chassi, diga onde e por quê — divergência declarada é
     aceitável, divergência silenciosa não. -->

- [ ] `npx tsc --noEmit` sem erros
- [ ] Sem push direto na `main` (este PR veio de branch dedicada)
- [ ] Commits seguem Conventional Commits
