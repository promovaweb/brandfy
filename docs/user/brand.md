# BRAND.md em detalhe

## Função do arquivo

`BRAND.md` é o guia canônico da marca no projeto consumidor. Ele fica na raiz,
separado do diretório de assets, para que você, os agentes e as ferramentas de
revisão o encontrem no mesmo lugar. O arquivo explica o que a marca significa,
como deve aparecer, quais escolhas já foram confirmadas e onde estão os
arquivos que materializam cada orientação.

`brand/README.md` não substitui `BRAND.md`: ele é um índice curto para navegar
pelos arquivos. Quando uma orientação do manual e uma descrição do índice
parecerem divergentes, a orquestradora corrige o índice e preserva `BRAND.md`
como fonte editorial.

## Como o arquivo é construído

`brandfy-setup` cria a estrutura inicial e `brandfy-mvp` preenche o que já está
documentado em `MVP.md`. Em seguida, `brandfy-entrevista`, `brandfy-estrategia`,
`brandfy-voz`, `brandfy-identidade-visual` e `brandfy-manual` consolidam as
respostas confirmadas. As demais especialistas adicionam os links para os
assets e os tokens, os templates, as licenças e as aplicações.

Uma nova execução atualiza somente os blocos administrados pelo Brandfy e
preserva notas humanas fora deles. O arquivo não deve receber promessas,
preferências ou exemplos sem fonte, sem aprovação ou sem a marca explícita de
suposição ainda não testada.

## Conteúdo esperado

### Identificação e resumo

Registra o nome, o estado da marca e a categoria. Traz também a descrição
curta, a promessa central e o resumo que permite entender o projeto sem abrir
todos os arquivos.

### Estratégia e posicionamento

Explica a base da marca (propósito, missão, visão, valores e princípios) e a
posição no mercado (público, problema, alternativas, diferenciais e razões para
acreditar). Também registra o posicionamento e as condições usadas para
comparar escolhas. Quando algo ainda não foi testado, o manual aponta essa
condição e liga o item a uma pergunta em `.brandfy/`.

### Personalidade e voz

Descreve a personalidade, a voz e os tons por situação. Registra ainda o
vocabulário, as mensagens, exemplos de formulações adequadas e os limites a
evitar. Com esse texto, outro redator produz uma mensagem coerente sem adivinhar
a intenção da marca.

### Direção visual

Registra o conceito visual e seus elementos:

- paleta, contraste e tipografia;
- fotografia, ilustração, iconografia, composição e motion;
- área livre, tamanho mínimo e variantes de logo.

Cada orientação aponta para o asset, o token ou a referência correspondente.

### Aplicações e canais

Relaciona as superfícies prioritárias e os templates instalados, com as
dimensões, as zonas seguras, os formatos de exportação e os usos permitidos.
Uma aplicação deve informar qual variante do logo e quais tokens deve usar.

### Governança e manutenção

Define os responsáveis por aprovação, as fontes de verdade e as licenças. Fixa
também a periodicidade de revisão, a forma de propor mudanças e a relação entre
o arquivo-fonte, as exportações, o manifesto e o arquivo arquivado.

### Lacunas e mapa de arquivos

Lista perguntas abertas, responsável, próximo passo e impacto da ausência. O
mapa de arquivos relaciona cada caminho de `brand/` com sua função, formato,
fonte editável e skill responsável pela atualização.

## Como ler o mapa de arquivos

O mapa evita que um agente trate uma exportação como fonte. Em geral:

| Caminho | Papel | Fonte de atualização |
| --- | --- | --- |
| `BRAND.md` | Guia completo da marca | `brandfy-manual` e escolhas confirmadas |
| `CHROMATIC.md` | Guia de cores: origem, esquema do círculo cromático e escolha final | `brandfy-identidade-visual` |
| `brand/README.md` | Índice dos assets | `brandfy-manual` |
| `brand/strategy.md` | Estratégia detalhada | `brandfy-estrategia` |
| `brand/voice.md` | Voz, tons e exemplos | `brandfy-voz` |
| `brand/tokens.json` e `brand/global.css` | Tokens de interface | `brandfy-design-tokens` |
| `brand/logo/` | Fontes e exportações do logo | `brandfy-logo` e `brandfy-ativos-logo` |
| `brand/templates/` | Modelos de canais | `brandfy-templates-canais` |
| `brand/brand-guide.pdf` | Manual compilado para leitura | `brandfy-guia-pdf` |
| `.brandfy/audit.md` | Relatório da auditoria | `brandfy-auditoria` |

O mapa real do projeto pode incluir caminhos adicionais. A orquestradora deve
atualizá-lo quando criar um novo asset, registrar a origem e indicar se o
arquivo é editável, gerado, arquivado ou apenas uma referência.

## Como usar o manual

Antes de criar uma peça, leia `BRAND.md`, depois `brand/README.md` e os arquivos
ligados ao canal. Use tokens em vez de copiar valores isolados, escolha a
variante correta do logo e respeite as licenças. Não altere uma orientação aprovada
para resolver uma peça específica sem registrar a revisão no manual.

Depois de alterar a marca, atualize `BRAND.md`, o índice e o asset relacionado.
Em seguida, recompile o manual para que a auditoria registre o novo estado.
