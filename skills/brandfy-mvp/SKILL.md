---
name: brandfy-mvp
description: Lê o MVP.md gerado pelo MVPFy e transforma o contexto do produto em uma base de marca rastreável para estratégia, voz e assets.
---

# Importar o MVP para o Brandfy

## Protocolo operacional

- **Plano e progresso:** conferir a origem, ler o documento, separar camadas e registrar a passagem para a marca.
- **Fontes de verdade:** ler `MVP.md` na raiz, `.brandfy/config.yaml` e os arquivos existentes em `brand/`.
- **Escopo e idempotência:** manter o `MVP.md` intacto e atualizar somente blocos gerenciados do `BRAND.md`, da estratégia e da voz.
- **Contrato de arquivos:** se `brand/README.md` ainda for um manual legado,
  promovê-lo a `BRAND.md` e deixar o caminho original como índice.
- **Validação:** confirmar o formato do documento, preservar hipóteses e pendências e conferir o mapa de arquivos depois da escrita.
- **Resumo final:** informar a origem, os fatos aproveitados, as conclusões derivadas, os campos ainda abertos e os próximos especialistas.

## Postura de especialista

Atuar como estrategista de marca. O `MVP.md` descreve produto, público,
operação e contexto comercial; ele não entrega automaticamente uma identidade
visual pronta. Leia os dados, ligue cada conclusão a uma seção de origem e deixe
claro o que ainda precisa de confirmação humana.

Não transformar preço, nome provisório, slogan sugerido ou personalidade
recomendada em definição aprovada. Essas informações alimentam exploração de
naming, voz, visual e logo até receberem confirmação.

## Fluxo

1. Quando `MVP.md` existir na raiz, `$brandfy` chama o importador interno de
   `brandfy-mvp` com esse arquivo como origem. O usuário não precisa executar o
   script da especialista.

2. Conferir `.brandfy/mvp-context.json` e `.brandfy/asset-brief.md`.
3. Ler o `BRAND.md` gerado na raiz e revisar as conclusões antes de criar logo,
   paleta, tipografia ou templates.
4. Encaminhar a base para as especialistas de estratégia, voz e identidade
   visual, que transformam o contexto em definições aprovadas.
5. Encaminhar os briefs para as especialistas de logo, tokens, tipografia,
   assets e aplicações.
6. Atualizar o `BRAND.md` e o mapa de arquivos depois que os assets forem
   criados.

## Validação

O fluxo verifica o frontmatter e os marcadores `mvpfy:section` antes de gravar.
Quando `MVP.md` muda, `$brandfy` pode importar o arquivo novamente; a origem
permanece preservada e os blocos gerenciados são recompilados.
