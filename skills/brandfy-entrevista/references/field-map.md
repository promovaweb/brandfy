# Correspondência entre campos e destinos

## Fonte estruturada

`.brandfy/interview.json` é o registro normalizado da entrevista. Respostas
literais, evidências e pendências permanecem ali. Os arquivos Markdown recebem
somente a síntese confirmada.

| Grupo do JSON | Destino principal | Validação posterior |
| --- | --- | --- |
| `brand`, `business` | `.brandfy/brief.md` | `$brandfy-diagnostico` |
| `audiences`, `positioning` | `brand/strategy.md` | `$brandfy-estrategia` |
| `personality`, `voice` | `brand/voice.md` | `$brandfy-voz` |
| `visual`, `identity` | `.brandfy/interview-summary.md` | `$brandfy-identidade-visual` e `$brandfy-logo` |
| `legal`, `evidence` | `brand/legal.md` | `$brandfy-naming` e revisão profissional |
| `progress`, `facts`, `interpretations` | `.brandfy/interview-summary.md` | `$brandfy-diagnostico` |
| `hypotheses`, `preferences` | `.brandfy/interview-summary.md` | Especialista do tema |
| `operations`, `unknowns`, `decisions` | `.brandfy/interview-summary.md` | `$brandfy-builder` |

## Regras de compilação

- Usar somente campos confirmados pelo participante.
- Mostrar “Não confirmado” quando um campo estrutural permanecer vazio.
- Não converter hipótese em promessa, público prioritário ou valor.
- Preservar as palavras do participante em `quotes`.
- Manter uma evidência ligada à afirmação que ela fundamenta.
- Registrar decisão com motivo, responsável e data.
- Registrar lacuna com pergunta, responsável e próximo passo.
- Registrar a confirmação de cada etapa com participante e data.
- Manter fato, interpretação, hipótese e preferência em coleções distintas.
- Atualizar apenas o bloco entre
  `<!-- brandfy:interview:start -->` e
  `<!-- brandfy:interview:end -->`.

## Gate mínimo

Antes da compilação final, confirmar ou registrar em `unknowns`:

- nome ou estado do naming;
- oferta e categoria;
- país ou região;
- problema e resultado desejado;
- ao menos um público em contexto real;
- alternativas atuais;
- promessa, diferença e razões para acreditar;
- traços e antitraços;
- princípios de voz;
- impressão visual e canais;
- aplicações prioritárias;
- responsável pela aprovação.

Também precisam estar identificados os participantes, o objetivo, a
confirmação da síntese e as confirmações das oito etapas da entrevista.

`status: ready` significa que o conteúdo pode seguir para validação das skills
especialistas. `status: approved` significa que os participantes confirmaram a
síntese, não que houve parecer jurídico ou validação de mercado.
