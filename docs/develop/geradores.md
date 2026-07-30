# Geradores e interfaces de linha de comando

## Setup

```bash
node skills/brandfy-setup/scripts/setup.mjs --project <diretório> [--check]
```

Sem `--check`, prepara `.brandfy/`, `brand/` e o bloco do consumidor no
`AGENTS.md`. Com `--check`, compara o estado esperado sem escrever.

## Entrevista

```bash
node skills/brandfy-entrevista/scripts/compile-interview.mjs \
  [--project <diretório>] [--input <arquivo>] [--init | --check]
```

`--init` cria o JSON inicial. `--check` valida cobertura e confirmações. Sem
esses modos, o script compila as respostas e atualiza os blocos delimitados nos
documentos derivados.

## Logos

```bash
node skills/brandfy-ativos-logo/scripts/export-logo.mjs \
  --input <diretório-svg> \
  --output <diretório-png> \
  [--manifest <arquivo>]
```

O exportador depende do ImageMagick. A interface precisa preservar as fontes
SVG e relatar qualquer variante que não possa ser rasterizada.

## Design tokens

```bash
node skills/brandfy-design-tokens/scripts/generate-tokens.mjs \
  --input <palette.json> \
  --output <diretório>
```

O gerador lê famílias e funções light/dark, escreve CSS, JSON, tema Tailwind e
relatório de contraste. A saída CSS inclui troca automática por
`prefers-color-scheme` e seletores explícitos por `data-theme`.

## Webfontes

```bash
node skills/brandfy-tipografia-web/scripts/download-fonts.mjs \
  --manifest <fonts.json> \
  --output <diretório>
```

O manifesto determina URLs, hashes quando disponíveis, licenças e fallbacks.
O script não deve baixar uma família cuja redistribuição não esteja
autorizada.

## Templates

```bash
node skills/brandfy-templates-canais/scripts/install-templates.mjs \
  --output <diretório> [--force]
```

Sem `--force`, arquivos existentes permanecem intactos. A opção explícita
substitui os templates conhecidos pelo conteúdo distribuído com a skill.

## Manual em PDF

```bash
node skills/brandfy-guia-pdf/scripts/build-brand-guide.mjs \
  --input <manual.md> \
  --output <manual.pdf> \
  [--css <impressao.css>]
```

O script cria HTML temporário com Pandoc e PDF com WeasyPrint. Caminhos de
recursos são resolvidos a partir do diretório do Markdown.

## Auditoria

```bash
node skills/brandfy-auditoria/scripts/audit-brand.mjs \
  --project <diretório> \
  [--config <arquivo>] \
  [--report <arquivo>]
```

A auditoria lê a configuração, verifica arquivos e grava o relatório. Ela deve
continuar sem escrita nos ativos, inclusive quando encontra reprovações.
