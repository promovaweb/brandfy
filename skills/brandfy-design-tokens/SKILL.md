---
name: brandfy-design-tokens
description: Gera paletas acessíveis e tokens para websites e sistemas. Use para produzir CSS, JSON e tema Tailwind nos modos light e dark.
---

# Gerar design tokens

## Protocolo operacional

- **Plano e progresso:** planejar esquema de harmonia, funções semânticas,
  escalas, contraste, geração e testes.
- **Fontes de verdade:** ler a paleta aprovada,
  [circulo-cromatico.md](references/circulo-cromatico.md) e
  [token-schema.md](references/token-schema.md).
- **Escopo e idempotência:** gerar arquivos derivados sem alterar
  `.brandfy/palette.json`.
- **Validação:** executar o gerador e conferir contraste WCAG para texto,
  controles, foco e estados, além da relação angular de matiz entre
  `primary` e `accent`.
- **Resumo final:** registrar arquivos, esquema de harmonia usado,
  combinações aprovadas e combinações recusadas.

## Fluxo

1. Escolher, com base em
   [circulo-cromatico.md](references/circulo-cromatico.md), um esquema de
   harmonia (monocromática, análoga, complementar, split-complementar,
   tríade ou tetrádica) e o matiz-base de `primary`.
2. Gerar `families.primary` e `families.accent` a partir do círculo
   cromático, em vez de escolher os 11 tons de cada família manualmente:

   ```bash
   node <caminho-da-skill>/scripts/gerar-paleta-cromatica.mjs \
     --hue <matiz-base 0-360> \
     --scheme <esquema> \
     --output .brandfy/palette.json
   ```

3. Completar `.brandfy/palette.json` com `families.neutral` e os modos
   `light`/`dark`.
4. Executar:

   ```bash
   node <caminho-da-skill>/scripts/generate-tokens.mjs \
     --input .brandfy/palette.json \
     --output brand
   ```

5. Gerar `brand/global.css`, `brand/tokens.json`,
   `brand/tailwind-theme.js`, `brand/accessibility.md` e, quando
   `palette.json` declarar `harmony`, `brand/color-harmony.md`.
6. Manter escalas numéricas para cada família e tokens semânticos para fundo,
   superfície, texto, texto secundário, borda, acento, foco, sucesso, aviso e
   erro.
7. Definir valores distintos para `:root` e `.dark`.
8. Documentar combinações permitidas. Não inferir legibilidade somente pela
   aparência.

Importe o CSS produzido por `$brandfy-tipografia-web` em `global.css` e abra
uma página nos modos light e dark. Uma fonte ausente deve acionar o fallback
documentado sem mudar a hierarquia ou esconder um texto.

## Raciocínio do especialista

Separar cor de origem, escala e função semântica. A relação entre `primary` e
`accent` nasce do círculo cromático, não de tentativa isolada: um esquema
declarado em `harmony` torna essa relação verificável e reprodutível.
Escolher tokens pela relação entre elementos, não pelo valor isolado.
Verificar contraste, diferenciação de estados, foco, daltonismo, impressão e
coerência entre light e dark. Uma cor de marca pode permanecer no logo e ser
inadequada para texto ou controle.
