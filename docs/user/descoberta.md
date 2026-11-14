# Descoberta e entrevista

## O Brandfy começa pelo que já existe

Ao iniciar o percurso, `$brandfy` lê a configuração e o estado em `.brandfy/`,
além de `BRAND.md`, do índice e dos assets existentes. Se houver `MVP.md` na raiz,
`brandfy-mvp` transforma o conteúdo em registro estruturado antes de abrir
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

Cada resposta recebe fonte, participante, estado e confirmação. Com o resumo
da entrevista, você retoma o trabalho sem transformar uma suposição em
definição aprovada.

## O diagnóstico

Depois da descoberta, `brandfy-diagnostico` compara o relato com os arquivos
do projeto. Ele aponta problemas como:

- logos duplicados, tokens sem fonte e fontes sem licença;
- aplicações incompatíveis, links quebrados e documentos desatualizados;
- assets que o manual promete mas não entrega.

O relatório não substitui a conversa. Ele lista as perguntas em ordem e mostra
qual arquivo ou uso motivou cada recomendação.

## Passagem para a estratégia

Quando a descoberta estiver confirmada, `brandfy-estrategia` define o propósito
e o posicionamento, a promessa e os diferenciais, os princípios e a
personalidade. A partir daí, a orquestradora chama naming, slogan, voz e
identidade visual conforme as lacunas e o escopo aprovados.
