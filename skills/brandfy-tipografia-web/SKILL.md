---
name: brandfy-tipografia-web
description: Seleciona webfonts, baixa arquivos licenciados e gera CSS tipográfico. Use para preparar fontes locais, fallbacks e escalas da marca.
---

# Preparar a tipografia para web

## Protocolo operacional

- **Plano e progresso:** planejar seleção, licença, arquivos, CSS e testes.
- **Fontes de verdade:** ler a direção visual, as licenças e
  [webfonts.md](references/webfonts.md).
- **Escopo e idempotência:** não baixar ou redistribuir fonte sem licença
  compatível. Preservar arquivos existentes com hash igual.
- **Validação:** conferir licença, MIME, peso, estilo, carregamento, fallback e
  legibilidade.
- **Resumo final:** registrar famílias, origem, licença, arquivos, CSS e
  pendências.

## Fluxo

1. Escolher famílias para títulos, corpo, interface e código com base no idioma,
   no repertório necessário e nas aplicações.
2. Preferir WOFF2 variável quando o suporte e a licença permitirem. Manter
   arquivos estáticos apenas para pesos realmente usados.
3. Registrar cada arquivo em `.brandfy/fonts.json`, incluindo URL direta,
   licença, autoria, peso, estilo e hash opcional.
4. Executar:

   ```bash
   node <caminho-da-skill>/scripts/download-fonts.mjs \
     --manifest .brandfy/fonts.json \
     --output brand/fonts
   ```

5. Gerar `brand/fonts/fonts.css` com `@font-face`, `font-display: swap`,
   fallbacks e tokens de família.
6. Definir escala, line-height, tracking, comprimentos de linha e usos por
   função no manual.
7. Testar acentos, números, símbolos, negrito, itálico e carregamento offline.

Quando a fonte for proprietária ou hospedada por serviço externo, gerar o CSS
de integração sem copiar o arquivo para o repositório.

## Raciocínio do especialista

Escolher tipografia pela tarefa: leitura longa, interface, título, número,
código, idioma e personalidade exigem parâmetros diferentes. Comparar cobertura
de caracteres, legibilidade, pesos úteis, métricas, performance, licença,
fallback e manutenção. A semelhança estética com uma referência não compensa
arquivo sem licença ou família que falha em acentos e telas pequenas.
