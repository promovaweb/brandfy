---
name: brandfy-design-tokens
description: Gera paletas acessíveis e tokens para websites e sistemas. Use para produzir CSS, JSON e tema Tailwind nos modos light e dark.
---

# Gerar design tokens

## Protocolo operacional

- **Plano e progresso:** planejar funções semânticas, escalas, contraste,
  geração e testes.
- **Fontes de verdade:** ler a paleta aprovada e
  [token-schema.md](references/token-schema.md).
- **Escopo e idempotência:** gerar arquivos derivados sem alterar
  `.brandfy/palette.json`.
- **Validação:** executar o gerador e conferir contraste WCAG para texto,
  controles, foco e estados.
- **Resumo final:** registrar arquivos, combinações aprovadas e combinações
  recusadas.

## Fluxo

1. Preencher `.brandfy/palette.json` com cores de origem e funções semânticas.
2. Executar:

   ```bash
   node <caminho-da-skill>/scripts/generate-tokens.mjs \
     --input .brandfy/palette.json \
     --output brand
   ```

3. Gerar `brand/global.css`, `brand/tokens.json`,
   `brand/tailwind-theme.js` e `brand/accessibility.md`.
4. Manter escalas numéricas para cada família e tokens semânticos para fundo,
   superfície, texto, texto secundário, borda, acento, foco, sucesso, aviso e
   erro.
5. Definir valores distintos para `:root` e `.dark`.
6. Documentar combinações permitidas. Não inferir legibilidade somente pela
   aparência.

Importe o CSS produzido por `$brandfy-tipografia-web` em `global.css` e abra
uma página nos modos light e dark. Uma fonte ausente deve acionar o fallback
documentado sem mudar a hierarquia ou esconder um texto.

## Raciocínio do especialista

Separar cor de origem, escala e função semântica. Escolher tokens pela relação
entre elementos, não pelo valor isolado. Verificar contraste, diferenciação de
estados, foco, daltonismo, impressão e coerência entre light e dark. Uma cor de
marca pode permanecer no logo e ser inadequada para texto ou controle.
