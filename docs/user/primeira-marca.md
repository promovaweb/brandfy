# Primeira marca com o Brandfy

## Prepare o projeto

Depois de executar `brandfy install .`, abra o projeto no agente escolhido e
converse com `$brandfy`. A orquestradora chama `brandfy-setup` antes de
qualquer definição e confere a raiz, o `AGENTS.md`, `.brandfy/`, `BRAND.md`,
`brand/README.md` e a estrutura de assets.

O setup preserva instruções fora do bloco gerenciado. Em um projeto antigo,
migra o conteúdo que ainda estiver em `brand/README.md` para `BRAND.md` e
mantém uma cópia no arquivo de arquivo quando necessário.

## A entrada do projeto

Se `MVP.md` existir na raiz, `$brandfy` chama `brandfy-mvp` antes da entrevista.
Essa especialista lê o documento gerado pelo MVPFy, mantém o arquivo intacto,
responde as perguntas já cobertas e registra as lacunas que ainda dependem de
uma pessoa.

Se `MVP.md` não existir, a orquestradora chama `brandfy-entrevista` para
descobrir o negócio, o público, a oferta, o problema, a diferença pretendida,
as provas, a personalidade, as aplicações e as restrições de uso.

Uma marca existente passa primeiro por `brandfy-diagnostico`. Ele confronta o
manual e os assets atuais com o contexto confirmado e indica o que deve ser
preservado, corrigido ou criado.

## O que precisa de confirmação

A pessoa usuária confirma nome, público, promessa, posicionamento, alternativas,
personalidade, voz, direção visual, aplicações prioritárias, licenças e
responsáveis por aprovação. O Brandfy não completa uma lacuna com uma resposta
apenas plausível.

Quando uma resposta ainda estiver aberta, `$brandfy` registra a pergunta,
mostra três caminhos quando a escolha for editorial e aguarda a confirmação
antes de avançar para a próxima especialista.

## O primeiro resultado

O primeiro percurso não entrega apenas uma pasta vazia. Ele deixa uma base
consultável em `.brandfy/`, um `BRAND.md` com as definições confirmadas e um
`brand/README.md` que aponta para os assets e documentos. As especialistas
seguintes completam estratégia, voz, direção visual, logos, tokens, templates,
manual e auditoria conforme o escopo.
