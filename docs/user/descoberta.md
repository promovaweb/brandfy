# Entrevista e diagnóstico

## Inicie a entrevista

A entrevista deve ser conduzida com os responsáveis pela marca e com permissão
para registrar as respostas. Inicialize a estrutura antes da conversa:

```bash
node .agents/skills/brandfy-entrevista/scripts/compile-interview.mjs --init
```

O comando cria `.brandfy/interview.json`. A skill conduz de três a cinco
perguntas por etapa, começando pelo trabalho atual da empresa. Depois de cada
bloco, ela resume fatos, hipóteses, escolhas e dúvidas para que o participante
possa corrigir a síntese.

A entrevista cobre oferta, públicos, alternativas, posicionamento,
personalidade, voz, direção visual, patrimônio existente, propriedade
intelectual, aplicações e governança. Respostas desconhecidas continuam
marcadas como desconhecidas, com uma pergunta e um responsável, em vez de
receberem uma formulação inventada.

## Valide a cobertura

Depois da conversa, execute:

```bash
node .agents/skills/brandfy-entrevista/scripts/compile-interview.mjs --check
```

O modo `--check` rejeita uma entrevista marcada como pronta quando faltam
confirmações, campos obrigatórios ou etapas. Corrija o JSON com as respostas
recebidas, preencha o nome do responsável e a data da confirmação, então rode
o compilador sem argumentos:

```bash
node .agents/skills/brandfy-entrevista/scripts/compile-interview.mjs
```

O compilador atualiza blocos delimitados e preserva texto escrito fora deles.
Ele produz a síntese da entrevista e leva conteúdo confirmado para o briefing,
a estratégia, a voz e o registro jurídico.

## Diagnostique uma marca existente

`$brandfy-diagnostico` abre os arquivos existentes em vez de confiar somente
nos nomes. O inventário registra formato, dimensão, versão, cor, fonte,
autoria, licença e uso observado. Ele compara o manual, o site, os templates e
as respostas da entrevista para encontrar convergências e divergências.

O diagnóstico não move nem converte ativos. Seu resultado fica em
`.brandfy/diagnostico.md` e indica quais skills precisam atuar. Um logo antigo
com reconhecimento comprovado pode ser preservado, enquanto uma paleta sem
contraste pode seguir para revisão de identidade visual e design tokens.

## Leia o resultado com os responsáveis

A síntese compilada é uma base para as especialidades, não aprovação automática
da estratégia. Releia os conflitos e as perguntas abertas antes de iniciar o
desenho. Uma divergência sobre o público prioritário ou a promessa altera voz,
logo, cor e aplicações, por isso deve permanecer visível até receber
confirmação.
