---
name: brandfy-entrevista
description: Conduz uma entrevista adaptativa de branding e transforma respostas confirmadas em briefing, estratégia, voz e pendências. Use antes de criar ou reposicionar uma marca.
---

# Entrevistar os responsáveis pela marca

## Protocolo operacional

- **Plano e progresso:** dividir a conversa em etapas curtas, registrar o
  avanço em `.brandfy/interview.json` e informar o que ainda falta.
  - **Fontes de verdade:** ler `.brandfy/` e `MVP.md` quando
  existirem, `brand/`,
  [interview-method.md](references/interview-method.md),
  [question-bank.md](references/question-bank.md) e
  [field-map.md](references/field-map.md).
- **Escopo e idempotência:** não substituir texto aprovado. O compilador
  atualiza somente blocos delimitados por `brandfy:interview`.
- **Validação:** separar fato, comprovação, interpretação, hipótese, preferência
  e pendência. Pedir confirmação antes de marcar a entrevista como pronta.
- **Resumo final:** informar respostas consolidadas, conflitos, campos
  preenchidos, perguntas abertas e skills recomendadas.

## Postura de especialista

Atuar como estrategista de marca e pesquisador, não como operador de
formulário. Fazer perguntas abertas e neutras, procurar episódios reais,
comparar o discurso com comprovações e explicar por que uma informação altera a
estratégia. Não aceitar adjetivos vagos como posicionamento sem pedir
comportamento, prova e contraste com alternativas.

Quando duas respostas entrarem em conflito, apresentar a tensão ao usuário e
pedir uma escolha ou registrar uma hipótese para pesquisa. Não completar
lacunas por plausibilidade. Uma resposta desconhecida continua desconhecida e
recebe responsável, pergunta e próximo passo.

## Fluxo da entrevista

1. Confirmar participantes, objetivo, escopo, privacidade e permissão para
   registrar as respostas.
2. Se `.brandfy/mvp-context.json` existir, usar os campos importados como
   respostas de contexto e consultar suas lacunas antes de abrir novas
   perguntas. Não repetir perguntas já respondidas no MVP.md.
3. Inicializar o arquivo estruturado:

   ```bash
   node .agents/skills/brandfy-entrevista/scripts/compile-interview.mjs --init
   ```

4. Fazer de três a cinco perguntas por etapa somente para lacunas. Começar pelo negócio e adaptar
   as próximas perguntas conforme as respostas.
5. Ao final de cada etapa, resumir fatos, hipóteses, escolhas e dúvidas.
   Pedir correção antes de avançar e registrar participante e data em
   `progress.stageConfirmations`.
6. Cobrir negócio, públicos, alternativas, posicionamento, personalidade, voz,
   direção visual, ativos, propriedade intelectual, operação e governança.
7. Registrar exemplos literais, fontes e comprovações no JSON. Evitar transcrever
   dados pessoais desnecessários. Usar as coleções próprias para fatos,
   interpretações, hipóteses, preferências, escolhas e perguntas abertas.
8. Rodar a verificação de cobertura:

   ```bash
   node .agents/skills/brandfy-entrevista/scripts/compile-interview.mjs --check
   ```

9. Resolver campos obrigatórios ou registrá-los em `unknowns`. Preencher
   `interview.confirmedBy` e `interview.confirmedAt`. Alterar `status` para
   `ready` somente depois da confirmação do usuário.
10. Compilar as respostas confirmadas:

   ```bash
   node .agents/skills/brandfy-entrevista/scripts/compile-interview.mjs
   ```

1. Abrir os arquivos gerados, reler com o usuário e encaminhar os próximos
    passos para `$brandfy-diagnostico`, `$brandfy-estrategia`,
    `$brandfy-voz` ou `$brandfy`.

## Gate de saída

A entrevista pode avançar quando nome ou estado do naming, oferta, contexto do
público, problema, resultado desejado, alternativas, diferença pretendida,
provas, personalidade, limites de voz, impressão visual, aplicações
prioritárias e responsável pela aprovação estiverem confirmados ou
explicitamente registrados como desconhecidos.

O arquivo compilado é uma base de trabalho, não aprovação automática da
estratégia. A skill especialista de cada etapa deve tensionar e validar o
conteúdo antes de tratá-lo como definição final.
