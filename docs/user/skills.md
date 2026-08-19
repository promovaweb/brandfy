# Skills do Brandfy

## Uma única conversa

A pessoa usuária conversa somente com `$brandfy`. Essa skill lê o estado do
projeto, identifica a próxima etapa e chama as especialistas instaladas sem
expor scripts, argumentos ou uma sequência manual de comandos.

As 19 skills formam um sistema coordenado. Cada uma possui uma responsabilidade
própria, mas a pessoa usuária não precisa escolher entre elas. O resultado de
uma etapa alimenta a próxima em `.brandfy/`, `BRAND.md` e `brand/`.

## Orquestração e preparação

### `brandfy`

É a porta de entrada do produto. Coordena leitura do projeto, importação do
MVP, perguntas complementares, estratégia, voz, identidade visual, produção de
assets, manual, PDF e auditoria. Retoma o estado existente e não repete uma
etapa já confirmada sem motivo registrado.

### `brandfy-setup`

Confere a consistência da raiz do projeto antes do trabalho. Cria ou atualiza
`.brandfy/config.yaml`, prepara diretórios, cria `BRAND.md`, deixa
`brand/README.md` como índice e mantém o bloco gerenciado no `AGENTS.md`.
Também migra um manual legado de `brand/README.md` para `BRAND.md` sem apagar o
conteúdo aprovado.

### `brandfy-mvp`

Lê `MVP.md` somente quando ele existe na raiz. Preserva o arquivo, extrai fatos
do produto, público, problema, mercado, operação, canais, validação e modelo de
negócio, e registra as lacunas que ainda exigem resposta. O resultado fica em
`.brandfy/mvp-context.json`, no briefing e nos briefs usados para criar assets.

## Descoberta e estratégia

### `brandfy-entrevista`

Faz as perguntas complementares que o MVP e os arquivos existentes não
respondem. Registra fatos, hipóteses, preferências, fontes, responsáveis e
confirmações em `.brandfy/interview.json` e no resumo da entrevista.

### `brandfy-diagnostico`

Confronta o relato e o contexto importado com arquivos, usos, logos, fontes,
licenças, canais e aplicações já existentes. Produz um diagnóstico do que pode
ser preservado, corrigido ou criado.

### `brandfy-estrategia`

Transforma contexto confirmado em propósito, missão, visão, valores,
posicionamento, promessa, diferenciais, princípios e personalidade. Liga cada
definição à fonte ou à escolha confirmada.

### `brandfy-naming`

Organiza a definição ou a revisão do nome. Compara opções por significado,
sonoridade, distinção, uso e disponibilidade indicativa, sem substituir análise
jurídica ou consulta oficial.

### `brandfy-slogan`

Desenvolve a assinatura verbal da marca a partir do posicionamento e da
promessa. Testa entendimento, ritmo, memorabilidade, contexto de uso e limites
da frase escolhida.

### `brandfy-voz`

Documenta a voz, os tons por situação, o vocabulário, as mensagens principais,
os limites e exemplos aprovados. O resultado orienta textos produzidos por
pessoas e agentes.

## Identidade visual

### `brandfy-identidade-visual`

Converte estratégia em direção visual. Define paleta, tipografia, fotografia,
ilustração, iconografia, composição, motion, acessibilidade e referências que
podem orientar a criação sem copiar outra marca.

### `brandfy-tipografia-web`

Seleciona webfontes compatíveis com a licença e com a direção visual. Registra
hierarquia, pesos, fallback, carregamento e CSS para que o produto mantenha a
mesma leitura em telas diferentes.

### `brandfy-logo`

Conduz o conceito e o sistema de logo. Define símbolo, assinatura, variantes,
área livre, tamanho mínimo, fundos permitidos e usos inadequados antes das
exportações finais.

### `brandfy-ativos-logo`

Exporta o sistema aprovado em SVG e PNG, cria favicons, avatares e manifestos,
confere dimensões e preserva o arquivo-fonte para futuras revisões.

### `brandfy-design-tokens`

Transforma paleta, tipografia, espaçamento e estados em tokens reutilizáveis.
Gera CSS, JSON e tema Tailwind e registra combinações de contraste que podem
ser usadas por componentes e aplicações.

## Aplicações e entrega

### `brandfy-aplicacoes`

Planeja as aplicações prioritárias da marca em superfícies digitais, sociais,
impressas e institucionais. Define formato, conteúdo, composição, zona segura,
variante do logo e arquivos que devem ser entregues.

### `brandfy-templates-canais`

Instala modelos editáveis para Instagram, LinkedIn, email e YouTube. Cada
template registra dimensões, campos variáveis, limites de texto, áreas seguras e
arquivos de exemplo.

### `brandfy-manual`

Consolida o conteúdo verbal, estratégico, visual, técnico e de governança em
`BRAND.md`. Também atualiza `brand/README.md` como índice, sem transformá-lo em
uma segunda fonte do manual.

### `brandfy-guia-pdf`

Compila `BRAND.md` do projeto consumidor em `brand/brand-guide.pdf`. Instala o
design system de PDF quando necessário, preserva personalizações e verifica
capa, sumário, fontes, imagens, links, tabelas e paginação.

### `brandfy-auditoria`

Confere a estrutura, a consistência entre `BRAND.md` e `brand/`, os arquivos
prometidos, dimensões, contraste, licenças, links e saídas compiladas. Registra
reprovações, avisos, comprovações e próximos passos em `.brandfy/audit.md`.

## O que a pessoa precisa fazer

A pessoa usuária instala o sistema com o CLI e conversa com `$brandfy`. Ela
confirma respostas, aprova direções e informa arquivos ou restrições que o
agente não pode descobrir sozinho. A orquestradora chama as especialistas,
explica os resultados e interrompe o percurso quando uma confirmação essencial
estiver faltando.
