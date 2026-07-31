---
name: brandfy-ativos-logo
description: Exporta e organiza variações de logo em SVG e PNG. Use para gerar versões light, dark, monocromáticas, ícones, favicons e manifesto.
---

# Exportar ativos do logo

## Protocolo operacional

- **Plano e progresso:** planejar fontes, variantes, tamanhos, exportação e
  inspeção.
- **Fontes de verdade:** ler os SVGs mestres, a configuração e
  [export-matrix.md](references/export-matrix.md).
- **Escopo e idempotência:** nunca sobrescrever o SVG mestre. Substituir
  exportações somente quando a fonte correspondente for mais recente.
- **Validação:** executar o exportador, abrir amostras e rodar a auditoria.
- **Resumo final:** informar variantes, dimensões, manifesto e falhas.

## Fluxo

1. Conferir `viewBox`, transparência, nomes, cores e ausência de imagens
   raster incorporadas no SVG mestre.
2. Manter as versões vetoriais em `brand/logo/svg/`.
3. Exportar PNGs com:

   ```bash
   node <caminho-da-skill>/scripts/export-logo.mjs \
     --input brand/logo/svg \
     --output brand/logo/png \
     --font brand/fonts/manrope-variable.ttf
   ```

4. Gerar versões light e dark, símbolo quadrado, avatar e favicons de
   `16`, `32`, `48`, `180`, `192` e `512` pixels quando houver fonte compacta.
5. Gerar `brand/manifest.json` com caminho, formato, dimensão, função e hash.
6. Inspecionar bordas, transparência, nitidez, proporção e leitura no tamanho
   mínimo.

O argumento `--font` é opcional. Use uma fonte TTF ou OTF local quando os SVGs
mantiverem o wordmark como texto editável.

O sufixo `light` ou `dark` precisa indicar o fundo de aplicação escolhido pelo
manual. Documentar essa convenção para evitar uso invertido.

## Raciocínio do especialista

Tratar a exportação como controle de qualidade do sistema, não como conversão
de formato. Relacionar cada arquivo a função, fundo, tamanho mínimo e canal.
Recusar exportações que introduzam deformação, cor inesperada, margem
inconsistente, transparência defeituosa ou dimensão diferente do manifesto.
