# BRAND.md em detalhe

## Função do arquivo

`BRAND.md` é o guia canônico da marca no projeto consumidor. Ele fica na raiz
para ser encontrado por pessoas, agentes, ferramentas de revisão e integrações
sem depender do diretório de assets. O arquivo explica o que a marca significa,
como deve aparecer, quais escolhas já foram confirmadas e onde estão os
arquivos que materializam cada regra.

`brand/README.md` não substitui `BRAND.md`. Ele é um índice curto para navegar
pelos arquivos. Quando uma regra do manual e uma descrição do índice parecerem
divergentes, a orquestradora deve corrigir o índice e preservar `BRAND.md` como
fonte editorial.

## Como o arquivo é construído

`brandfy-setup` cria a estrutura inicial. `brandfy-mvp` preenche o que já está
documentado em `MVP.md`. `brandfy-entrevista`, `brandfy-estrategia`,
`brandfy-voz`, `brandfy-identidade-visual` e `brandfy-manual` consolidam as
respostas confirmadas. As demais especialistas adicionam os links para assets,
tokens, templates, licenças e aplicações.

Uma nova execução atualiza somente os blocos administrados pelo Brandfy e
preserva notas humanas fora deles. O arquivo não deve receber promessas,
preferências ou exemplos que não tenham fonte, aprovação ou indicação explícita
de hipótese.

## Conteúdo esperado

### Identificação e resumo

Registra o nome, o estado da marca, a categoria, a descrição curta, a promessa
central e o resumo que permite entender o projeto sem abrir todos os arquivos.

### Estratégia e posicionamento

Explica propósito, missão, visão, valores, princípios, público, problema,
alternativas, diferenciais, razões para acreditar, posicionamento e critérios
usados para comparar escolhas. Quando algo ainda for hipótese, o manual aponta
essa condição e liga o item a uma pergunta em `.brandfy/`.

### Personalidade e voz

Descreve atributos de personalidade, voz, tons por contexto, vocabulário,
mensagens, exemplos de formulações adequadas e limites que devem ser evitados.
O texto precisa permitir que outra pessoa produza uma mensagem coerente sem
adivinhar a intenção da marca.

### Direção visual

Registra conceito, paleta, contraste, tipografia, fotografia, ilustração,
iconografia, composição, motion, área livre, tamanho mínimo e variantes de
logo. Cada regra aponta para o asset, token ou referência correspondente.

### Aplicações e canais

Relaciona as superfícies prioritárias, os templates instalados, as dimensões,
as zonas seguras, os formatos de exportação e os usos permitidos. Uma aplicação
deve informar qual variante do logo e quais tokens deve usar.

### Governança e manutenção

Define responsáveis por aprovação, fontes de verdade, licenças, periodicidade
de revisão, forma de propor mudanças e relação entre arquivo-fonte,
exportações, manifesto e arquivo arquivado.

### Lacunas e mapa de arquivos

Lista perguntas abertas, responsável, próximo passo e impacto da ausência. O
mapa de arquivos relaciona cada caminho de `brand/` com sua função, formato,
fonte editável e skill responsável pela atualização.

## Como ler o mapa de arquivos

O mapa evita que um agente trate uma exportação como fonte. Em geral:

| Caminho | Papel | Fonte de atualização |
| --- | --- | --- |
| `BRAND.md` | Guia completo da marca | `brandfy-manual` e escolhas confirmadas |
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

## Regras de uso

Antes de criar uma peça, leia `BRAND.md`, depois `brand/README.md` e os arquivos
ligados ao canal. Use tokens em vez de copiar valores isolados, escolha a
variante correta do logo e respeite as licenças. Não altere uma regra aprovada
para resolver uma peça específica sem registrar a revisão no manual.

Depois de alterar a marca, atualize `BRAND.md`, o índice e o asset relacionado,
recompile o manual e deixe a auditoria registrar o novo estado.
