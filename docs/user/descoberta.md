# Descoberta e contexto

## O Brandfy começa pelo que já existe

Ao iniciar o percurso, `$brandfy` lê a configuração, `BRAND.md`, o índice, os
assets existentes e o estado em `.brandfy/`. Se houver `MVP.md` na raiz,
`brandfy-mvp` transforma o conteúdo em contexto estruturado antes de abrir
qualquer nova pergunta.

Essa ordem evita repetir respostas e permite que a entrevista seja usada para
completar somente o que o MVP não registrou. O documento do MVP não é editado;
as conclusões para a marca ficam em `.brandfy/mvp-context.json`, no briefing e
nos briefs de assets.

## O que a entrevista cobre

`brandfy-entrevista` conduz a conversa complementar sobre:

- nome, estado da marca e categoria;
- público, personas, problema, alternativas e resultado desejado;
- oferta, modelo de negócio, jornada, canais e operação;
- posicionamento, promessa, diferenças, provas e objeções;
- personalidade, voz, tom, vocabulário e exemplos;
- direção visual, aplicações, logo, tipografia, imagens e acessibilidade;
- licenças, responsáveis, aprovação, prazo e revisão.

Cada resposta recebe fonte, participante, estado e confirmação. O resumo da
entrevista permite retomar o trabalho sem transformar uma hipótese em regra.

## O diagnóstico

Depois da descoberta, `brandfy-diagnostico` compara o relato com os arquivos
reais. Ele identifica logos duplicados, tokens sem fonte, fontes sem licença,
aplicações incompatíveis, links quebrados, documentos desatualizados e assets
que o manual promete mas não entrega.

O relatório não substitui a conversa. Ele organiza as perguntas e mostra qual
arquivo ou uso motivou cada recomendação.

## Passagem para a estratégia

Quando o contexto estiver confirmado, `brandfy-estrategia` organiza propósito,
posicionamento, promessa, diferenciais, princípios e personalidade. A partir
daí, a orquestradora chama naming, slogan, voz e identidade visual conforme as
lacunas e o escopo aprovados.
