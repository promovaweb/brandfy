---
name: brandfy
description: Orquestra instalação, contexto do MVP, estratégia, voz, visual e assets de uma marca em um único percurso verificável.
---

# Brandfy

## Papel da skill

`brandfy` é a única porta de entrada conversacional do sistema. A pessoa usuária
chama esta skill uma vez e acompanha o percurso completo. As demais skills são
especialistas internas: a orquestradora escolhe a ordem, entrega os arquivos
necessários e registra o resultado de cada etapa.

Não peça para a pessoa usuária chamar `brandfy-setup`, `brandfy-mvp`,
`brandfy-entrevista` ou qualquer outra especialista diretamente. Quando uma
etapa exigir uma dessas capacidades, chame a skill correspondente no fluxo
interno e explique o que mudou no projeto.

## Protocolo operacional

- **Plano e progresso:** criar um plano com as etapas do percurso, atualizar o
  estado após cada marco e informar a próxima ação.
- **Fontes de verdade:** ler `.brandfy/config.yaml`, `MVP.md` na raiz quando
  existir, `.brandfy/mvp-context.json`, `.brandfy/brief.md`, `BRAND.md`,
  `brand/README.md`, os assets existentes e os contratos das especialistas.
- **Escopo e idempotência:** preservar arquivos aprovados, retomar o estado
  registrado e arquivar substituições em `brand/archive/`.
- **Interação:** conduzir a pessoa somente pelas perguntas que ainda não têm
  resposta confirmada. Mostrar o que veio do MVP, o que foi inferido e o que
  ainda aguarda resposta.
- **Validação:** chamar `brandfy-auditoria`, conferir `BRAND.md`, o índice, os
  arquivos gerados, licenças, links e o PDF do manual da marca.
- **Resumo final:** listar os artefatos, as fontes usadas, as escolhas
  confirmadas, as pendências e as validações executadas.

## Percurso coordenado

1. Chamar `$brandfy-setup` para validar a raiz do projeto, preparar `.brandfy/`,
   criar ou conferir `BRAND.md`, manter `brand/README.md` como índice e
   atualizar o bloco gerenciado do `AGENTS.md`.
2. Procurar `MVP.md` somente na raiz. Se existir, chamar `$brandfy-mvp` para
   importar o documento sem alterá-lo, preencher o contexto e transformar os
   fatos em base de marca e briefs de assets.
3. Ler as lacunas registradas. Chamar `$brandfy-entrevista` somente para
   perguntas que o MVP e os arquivos existentes não respondem. Confirmar as
   respostas antes de usá-las em estratégia ou identidade.
4. Chamar `$brandfy-diagnostico` para confrontar o contexto com o manual, os
   assets, os usos existentes e os arquivos do projeto.
5. Chamar `$brandfy-estrategia` para definir propósito, posicionamento,
   promessa, diferenciais, princípios, personalidade e parâmetros de escolha.
6. Chamar `$brandfy-naming` quando o nome ainda estiver aberto e
   `$brandfy-slogan` quando a marca precisar de uma assinatura verbal.
7. Chamar `$brandfy-voz` para documentar voz, tons, vocabulário, mensagens e
   exemplos de aplicação.
8. Chamar `$brandfy-identidade-visual` para definir direção visual, cores,
   tipografia, imagem, ilustração, iconografia e motion.
9. Chamar `$brandfy-tipografia-web` para selecionar webfontes licenciadas,
   hierarquia e CSS tipográfico.
10. Chamar `$brandfy-logo` para criar ou revisar o conceito e o sistema de
    logo. Depois chamar `$brandfy-ativos-logo` para exportar SVG, PNG,
    favicons, avatares e manifestos.
11. Chamar `$brandfy-design-tokens` para gerar CSS, JSON e tema Tailwind.
12. Chamar `$brandfy-aplicacoes` e `$brandfy-templates-canais` para produzir
    as aplicações prioritárias e os modelos editáveis de cada canal.
13. Chamar `$brandfy-manual` para consolidar o conteúdo completo de `BRAND.md`
    e atualizar `brand/README.md` como índice dos arquivos.
14. Chamar `$brandfy-guia-pdf` para compilar o manual da marca em
    `brand/brand-guide.pdf`.
15. Chamar `$brandfy-auditoria` para testar a estrutura, os links, os assets,
    acessibilidade, licenças, consistência e saídas finais.

Uma marca existente pode pular uma etapa já aprovada quando o diagnóstico
registrar a fonte que sustenta o salto. Uma etapa só fica concluída quando a
saída correspondente existe ou quando a pessoa usuária confirmou que ela não
faz parte do escopo atual.

## Saída obrigatória

Ao terminar, o projeto deve ter `BRAND.md` na raiz. Esse arquivo é o guia
canônico da marca e explica estratégia, posicionamento, voz, direção visual,
regras de uso, aplicações, governança, fontes, lacunas e o mapa dos arquivos.
`brand/README.md` é somente um índice curto: aponta para `BRAND.md`, organiza os
arquivos por função e informa o que cada asset representa.

O estado intermediário permanece em `.brandfy/`, com configuração, contexto
importado, briefing, entrevista, briefs e relatório de auditoria. O diretório
`brand/` contém os assets e documentos editáveis da marca.

## Gate de saída

Não declarar a marca pronta quando houver campos centrais sem confirmação,
assets prometidos ausentes, links quebrados, licença desconhecida, divergência
entre `BRAND.md` e `brand/README.md` ou auditoria reprovada. Registrar cada
pendência com pergunta, responsável e próximo passo.
