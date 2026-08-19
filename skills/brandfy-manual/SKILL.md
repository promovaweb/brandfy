---
name: brandfy-manual
description: Compila o guia editável da marca a partir dos arquivos aprovados. Use para criar ou atualizar BRAND.md e o índice operacional de brand.
---

# Compilar o manual da marca

## Protocolo operacional

- **Plano e progresso:** planejar coleta, redação, links, revisão e compilação.
- **Fontes de verdade:** ler todos os arquivos aprovados, `BRAND.md` e o índice
  `brand/README.md`, além de [manual-outline.md](references/manual-outline.md).
- **Escopo e idempotência:** atualizar seções afetadas sem apagar exemplos,
  exceções ou histórico válido.
- **Validação:** conferir cada afirmação nos arquivos finais, validar links e
  usar `$brandfy-auditoria`.
- **Resumo final:** informar seções alteradas, fontes usadas e pendências.

## Fluxo

1. Usar `BRAND.md` como fonte Markdown editável do guia.
2. Documentar essência, propósito, missão, visão, valores, públicos,
   posicionamento, personalidade, voz, mensagens, naming e slogan.
3. Documentar logo, variantes light/dark, símbolo, área de proteção, tamanho
   mínimo, cores, tipografia, fotografia, ilustração, iconografia, composição,
   motion e aplicações.
4. Incluir acessibilidade, licenças, consentimentos, marca registrada,
   co-branding, arquivos oficiais, usos proibidos, versionamento e governança.
5. Usar caminhos relativos para imagens e exemplos que também serão exibidos
   no PDF.
6. Encaminhar a compilação para `$brandfy-guia-pdf`.

Compare cada seção com o arquivo vinculado. Quando o manual citar uma variante
light, abra o SVG e uma exportação PNG sobre o fundo indicado, pois um nome
correto não comprova que a cor e a aplicação estejam certas.

## Raciocínio do especialista

Escrever o manual como instrumento de escolha. Cada regra importante precisa
explicar princípio, aplicação, limite e exemplo. Distinguir definição aprovada,
orientação, exceção e pendência. Remover declarações que não possam ser ligadas
a um arquivo, comportamento, comprovação ou responsável.
