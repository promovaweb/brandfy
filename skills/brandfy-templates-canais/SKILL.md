---
name: brandfy-templates-canais
description: Cria templates visuais padronizados para canais digitais. Use para Instagram, LinkedIn, cabeçalhos de email, thumbnails e banners do YouTube.
---

# Criar templates para canais

## Protocolo operacional

- **Plano e progresso:** planejar canais, formatos, variações, exportação e
  teste.
- **Fontes de verdade:** ler o manual, os tokens, os ativos e
  [channel-guides.md](references/channel-guides.md).
- **Escopo e idempotência:** copiar os exemplos para `brand/templates/` antes
  de adaptar. Preservar os modelos instalados na skill.
- **Validação:** conferir tamanho, zona segura, densidade, contraste, logo,
  tipografia e leitura em mobile.
- **Resumo final:** registrar templates, variações, exportações e limitações.

## Fluxo

1. Selecionar os canais usados pela marca.
2. Copiar os SVGs necessários:

   ```bash
   node <caminho-da-skill>/scripts/install-templates.mjs \
     --output brand/templates
   ```

3. Substituir placeholders, cores e famílias pelas definições de
   `brand/global.css` e `brand/fonts/fonts.css`.
4. Criar variações suficientes para evitar uma composição repetida em todas as
   publicações, sem romper o sistema visual.
5. Manter campos editáveis para título, apoio, imagem, assinatura, seção,
   número e chamada.
6. Exportar PNG ou JPG e inspecionar no tamanho real de consumo.
7. Documentar uso, limite de caracteres, zona segura e variante de logo ao lado
   de cada template.

Abra o SVG escolhido, troque os placeholders e exporte uma amostra com a
paleta da marca. A inspeção no feed ou na tela alvo revela texto pequeno, zona
segura invadida e logo aplicado na variante errada.

## Raciocínio do especialista

Tratar template como regra flexível. Fixar o que protege reconhecimento,
acessibilidade e produção; permitir variação onde o conteúdo exige ritmo.
Testar títulos curtos e longos, ausência de imagem, fotografia clara e escura,
tradução, recorte móvel e exportação. Um modelo que funciona apenas com o
exemplo ideal ainda não está pronto para agentes.
