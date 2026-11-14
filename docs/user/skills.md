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

É a porta de entrada do produto. Coordena a leitura do projeto, a importação
do MVP e as perguntas complementares, depois a estratégia, a voz e a
identidade visual, até a produção de assets, o manual, o PDF e a auditoria.
Retoma o estado existente e não repete uma etapa já confirmada sem motivo
registrado.

### `brandfy-setup`

Confere a consistência da raiz do projeto antes do trabalho. Cria ou atualiza
`.brandfy/config.yaml` e prepara os diretórios. Também cria `BRAND.md`, deixa
`brand/README.md` como índice e mantém o bloco gerenciado no `AGENTS.md`.
Também migra um manual legado de `brand/README.md` para `BRAND.md` sem apagar o
conteúdo aprovado.

### `brandfy-mvp`

Lê `MVP.md` somente quando ele existe na raiz e preserva o arquivo. Extrai os
fatos de produto, público e problema, assim como os de mercado, operação,
canais, validação e modelo de negócio. Também registra as lacunas que ainda
exigem resposta. O resultado fica em
`.brandfy/mvp-context.json`, no briefing e nos briefs usados para criar assets.

## Descoberta e estratégia

### `brandfy-entrevista`

Faz as perguntas complementares que o MVP e os arquivos existentes não
respondem. Registra fatos, suposições e preferências com as fontes, os
responsáveis e as confirmações em `.brandfy/interview.json` e no resumo da
entrevista.

### `brandfy-diagnostico`

Confronta o relato e o material importado com o que já existe no projeto: os
arquivos e seus usos, os logos, as fontes e as licenças, os canais e as
aplicações. Produz um diagnóstico do que pode ser preservado, corrigido ou
criado.

### `brandfy-estrategia`

Transforma a descoberta confirmada na base da marca (propósito, missão, visão e
valores) e no posicionamento, com promessa, diferenciais, princípios e
personalidade. Liga cada definição à fonte ou à escolha confirmada.

### `brandfy-naming`

Conduz a definição ou a revisão do nome. Compara opções pelo significado e pela
sonoridade, pela distinção e pelo uso, com uma indicação de disponibilidade que
não substitui análise jurídica ou consulta oficial.

### `brandfy-slogan`

Desenvolve a assinatura verbal da marca a partir do posicionamento e da
promessa. Testa se a frase escolhida é entendida e fácil de guardar, como soa e
para quais situações serve.

### `brandfy-voz`

Documenta a voz e os tons por situação, o vocabulário e as mensagens
principais, com os limites e os exemplos aprovados. O resultado orienta os
textos produzidos pelos redatores e pelos agentes.

## Identidade visual

### `brandfy-identidade-visual`

Converte estratégia em direção visual. Define paleta e tipografia, os estilos
de imagem (fotografia, ilustração e iconografia), a composição e o motion.
Registra também a acessibilidade e as referências que orientam a criação sem
copiar outra marca.

### `brandfy-tipografia-web`

Seleciona webfontes compatíveis com a licença e com a direção visual. Registra
hierarquia e pesos, fallback, carregamento e CSS para que o produto mantenha a
mesma leitura em telas diferentes.

### `brandfy-logo`

Conduz o conceito e o sistema de logo. Antes das exportações finais, define o
símbolo, a assinatura e as variantes, além da área livre, do tamanho mínimo,
dos fundos permitidos e dos usos inadequados.

### `brandfy-ativos-logo`

Exporta o sistema aprovado em SVG e PNG e cria favicons, avatares e
manifestos. Depois confere as dimensões e preserva o arquivo-fonte para
futuras revisões.

### `brandfy-design-tokens`

Transforma paleta, tipografia, espaçamento e estados em tokens reutilizáveis.
Gera CSS, JSON e tema Tailwind e registra combinações de contraste que podem
ser usadas por componentes e aplicações.

## Aplicações e entrega

### `brandfy-aplicacoes`

Planeja as aplicações prioritárias da marca em superfícies digitais, sociais,
impressas e institucionais. Para cada peça, define formato, conteúdo e
composição, com a zona segura, a variante do logo e os arquivos esperados.

### `brandfy-templates-canais`

Instala modelos editáveis para Instagram, LinkedIn, email e YouTube. Cada
template registra dimensões e campos variáveis, limites de texto, áreas
seguras e arquivos de exemplo.

### `brandfy-manual`

Consolida o conteúdo verbal, estratégico, visual, técnico e de governança em
`BRAND.md`. Também atualiza `brand/README.md` como índice, sem transformá-lo em
uma segunda fonte do manual.

### `brandfy-guia-pdf`

Compila `BRAND.md` do projeto consumidor em `brand/brand-guide.pdf`. Instala o
design system de PDF quando necessário, preserva personalizações e verifica a
capa e o sumário, as fontes e as imagens, os links, as tabelas e a paginação.

### `brandfy-auditoria`

Confere a estrutura e a consistência entre `BRAND.md` e `brand/`. Verifica
também os arquivos prometidos, as dimensões, o contraste, as licenças, os links
e as saídas compiladas. Registra
reprovações, avisos, comprovações e próximos passos em `.brandfy/audit.md`.

## O que você precisa fazer

A pessoa usuária instala o sistema com o CLI e conversa com `$brandfy`. Ela
confirma respostas, aprova direções e informa arquivos ou restrições que o
agente não pode descobrir sozinho. A orquestradora chama as especialistas,
explica os resultados e interrompe o percurso quando uma confirmação essencial
estiver faltando.
