# Arquitetura do Brandfy

## Biblioteca instalada no projeto consumidor

O Brandfy distribui conhecimento e automação como diretórios independentes
dentro de `skills/`. O gerenciador `skills add` copia as especialidades
selecionadas para o projeto consumidor. A execução acontece no repositório da
marca, por isso os scripts resolvem entradas e saídas a partir do diretório
informado, não a partir de dados privados guardados no Brandfy.

| Origem | Passagem | Destino |
| --- | --- | --- |
| Repositório Brandfy | `skills add` seleciona e copia as especialidades | Skills instaladas no projeto consumidor |
| Skills instaladas | O agente lê método, referências e entradas locais | `.brandfy/` recebe pesquisa e acompanhamento |
| Skills instaladas | Os geradores escrevem fontes e derivados aprovados | `brand/` recebe manual e ativos |
| `brand/` | A auditoria confronta definição, fonte e aplicação | `.brandfy/audit.md` registra o resultado |

`.brandfy/` recebe configuração, entrevista, briefing e relatórios. `brand/`
recebe o manual, os ativos e as saídas compiladas. O agente lê as duas fontes,
mas não mistura trabalho reservado com arquivos destinados a publicação.

## CLI e gerenciador de skills

O pacote npm vive em `cli/` e expõe o comando `brandfy`. Essa camada resolve a
versão empacotada do `skills`, executa `skills add` no projeto consumidor e
localiza os scripts instalados em `.agents/skills/`, `.codex/skills/` ou
`.claude/skills/`.

O CLI não incorpora uma segunda cópia dos geradores. `brandfy pdf` e
`brandfy audit` executam os arquivos das skills instaladas, mantendo uma única
fonte para o comportamento. O framework, o pacote npm e o ebook usam a mesma
SemVer, conferida por `npm run release:check`.

## Tipos de skill

As 18 skills cumprem quatro papéis:

| Papel | Skills |
| --- | --- |
| Coordenação | `brandfy-setup`, `brandfy-builder` |
| Descoberta e base verbal | `brandfy-entrevista`, `brandfy-diagnostico`, `brandfy-estrategia`, `brandfy-naming`, `brandfy-slogan`, `brandfy-voz` |
| Sistema visual | `brandfy-identidade-visual`, `brandfy-logo`, `brandfy-tipografia-web`, `brandfy-design-tokens` |
| Produção e conferência | `brandfy-ativos-logo`, `brandfy-aplicacoes`, `brandfy-templates-canais`, `brandfy-manual`, `brandfy-guia-pdf`, `brandfy-auditoria` |

As skills de coordenação fazem handoff para uma especialidade e retomam o
plano quando o arquivo esperado existe. Elas não duplicam o método detalhado
pela skill chamada.

## Limites de escrita

Os geradores são idempotentes por contrato. O setup atualiza somente o bloco
delimitado no `AGENTS.md`; o compilador de entrevista atualiza blocos
`brandfy:interview`; o instalador de templates preserva arquivos existentes
sem `--force`. Exportações derivadas podem ser atualizadas quando sua fonte
correspondente mudou.

Um script não deve mover nem reescrever um ativo aprovado sem uma opção
explícita e documentada. O diagnóstico e a auditoria são essencialmente
leitores: eles registram achados em relatório e deixam a correção para a
especialidade apropriada.

## Dependências externas

O núcleo dos geradores usa APIs nativas do Node.js. O CLI depende do pacote
`skills`, com versão fixa no lock. ImageMagick entra na rasterização dos logos
e templates. Pandoc e WeasyPrint entram na compilação de PDFs. O projeto
mantém os três últimos programas fora das dependências npm porque eles possuem
ciclos de instalação próprios.
