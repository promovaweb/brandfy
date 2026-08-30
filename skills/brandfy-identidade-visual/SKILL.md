---
name: brandfy-identidade-visual
description: Define o sistema visual da marca além do logo. Use para criar direção de arte, paleta, tipografia, fotografia, ilustração e iconografia.
---

# Definir a identidade visual

## Protocolo operacional

- **Plano e progresso:** planejar referências, rotas visuais, protótipos e
  seleção.
- **Fontes de verdade:** ler estratégia, voz, `BRAND.md`, `CHROMATIC.md`,
  `.brandfy/mvp-context.json`, `.brandfy/asset-brief.md`,
  `.brandfy/interview-summary.md`, ativos atuais e
  [visual-system.md](references/visual-system.md).
- **Escopo e idempotência:** manter referências com origem e não substituir
  ativos aprovados durante a exploração.
- **Validação:** testar cada rota em aplicações reais, nos modos light e dark e
  em tela pequena.
- **Resumo final:** registrar a direção escolhida, o motivo, os ativos e as
  pendências.

## Fluxo

1. Traduzir atributos estratégicos em forma, composição, densidade, contraste
   e materialidade.
2. Criar duas ou três rotas visuais distintas, sem imitar concorrentes.
3. Definir a cor-base a partir de pesquisa ou preferência declarada, nunca por
   gosto do agente: usar cor de referência pesquisada na categoria, cultura ou
   concorrência, ou a cor preferida registrada em `preferences` na entrevista
   (`.brandfy/interview.json`, ver `$brandfy-entrevista`). Quando nenhuma das
   duas existir, perguntar ao responsável pela marca antes de prosseguir.
4. Ajustar essa cor-base tecnicamente pelo círculo cromático: escolher um
   esquema de harmonia com `$brandfy-design-tokens`
   (`references/circulo-cromatico.md`) e registrar origem, esquema e escolha
   em `CHROMATIC.md`.
5. Definir paleta funcional com combinações de fundo, texto, acento, estado e
   superfície, a partir das famílias derivadas do círculo cromático.
6. Definir tipografia, escala, espaçamento, fotografia, tratamento de imagem,
   ilustração, iconografia, grafismos, grid e motion.
7. Prototipar as rotas em página web, avatar, peça social e documento.
8. Selecionar uma rota e registrar os princípios em
   `.brandfy/visual-direction.md`.
9. Encaminhar cores e tipografia para `$brandfy-design-tokens` e
   `$brandfy-tipografia-web`.

O sistema visual precisa continuar reconhecível sem o logo. Não depender
somente da cor para comunicar estado ou hierarquia.

## Raciocínio do especialista

Traduzir cada atributo estratégico em princípios visuais observáveis, como
contraste, ritmo, proporção, densidade, materialidade e comportamento de
imagem. Uma rota visual precisa explicar ideia, sinais, vantagens, limitações e
condições de uso. Comparar rotas nas mesmas aplicações e com acabamento
equivalente para reduzir viés de apresentação.
