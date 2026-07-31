# Guia completo do usuário

Uma marca costuma começar com material espalhado: um logo usado no site, cores
copiadas de apresentações, fontes escolhidas por hábito e explicações que
somente uma parte da empresa conhece. O Brandfy reúne esse material, conduz as
definições que ainda faltam e grava um sistema que pessoas e agentes conseguem
consultar antes de criar uma nova peça.

O Brandfy é uma biblioteca de skills para agentes. Ele não substitui a
conversa com os responsáveis pela marca, a pesquisa jurídica nem a revisão de
um designer. As skills ajudam a registrar evidências, comparar alternativas,
produzir arquivos repetíveis e mostrar o que ainda precisa de aprovação
humana.

## Leia online ou como parte do ebook

Este percurso e a referência técnica são publicados no mesmo PDF e EPUB. Os
arquivos Markdown em `docs/` são a fonte editorial, por isso uma correção feita
aqui entra nas duas edições no próximo build.

- O PDF preserva a diagramação e funciona bem para leitura, compartilhamento e
  impressão.
- O EPUB permite ajustar a fonte e o tamanho em leitores digitais.

Baixe o
[PDF da documentação completa](../../ebooks/Brandfy-Documentacao-Completa-v1.1.0.pdf)
ou o
[EPUB da documentação completa](../../ebooks/Brandfy-Documentacao-Completa-v1.1.0.epub).
A [pasta dos ebooks](../../ebooks/README.md) registra a edição vigente e os
hashes dos artefatos.

## Percurso recomendado

Comece pela [instalação](instalacao.md) e confirme que as skills aparecem no
projeto. Depois, leia [como o Brandfy organiza os arquivos](conceitos.md) antes
de executar o setup. Essa ordem evita que `.brandfy/` seja confundido com a
pasta pública `brand/`.

O trabalho completo segue esta sequência:

1. [Instale e confira as skills](instalacao.md).
2. [Entenda os arquivos e as camadas de informação](conceitos.md).
3. [Prepare o projeto consumidor](primeira-marca.md).
4. [Conduza a entrevista e o diagnóstico](descoberta.md).
5. [Construa ou revise o sistema de marca](sistema-de-marca.md).
6. [Gere logos, tokens, webfontes e templates](ativos-digitais.md).
7. [Compile o manual e o PDF da marca](manual-e-pdf.md).
8. [Audite os arquivos antes de publicar](auditoria.md).
9. [Oriente outros agentes a usar a marca](agentes.md).
10. [Investigue falhas conhecidas](solucao-de-problemas.md).

Uma marca existente pode começar pelo diagnóstico e preservar tudo o que já
possui evidência de uso e aprovação. Uma marca nova precisa de entrevista antes
da direção verbal e visual, pois o agente não deve completar uma lacuna com uma
resposta apenas plausível.

## O resultado no repositório

Ao final, o projeto consumidor mantém a origem do trabalho em `.brandfy/` e os
arquivos utilizáveis em `brand/`. Um conjunto completo pode conter estratégia,
voz, logos vetoriais e raster, favicons, paleta, tokens CSS e JSON, tema
Tailwind, webfontes, templates, regras de acessibilidade, licenças, manifesto e
manual em PDF.

O relatório `.brandfy/audit.md` fecha o percurso ao confrontar o manual com os
arquivos produzidos. A aprovação automática não dispensa a abertura do PDF,
dos logos e de pelo menos uma aplicação de cada canal no tamanho final.
