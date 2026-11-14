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
responde as perguntas já cobertas e registra as lacunas que ainda dependem da
sua resposta.

Se `MVP.md` não existir, a orquestradora chama `brandfy-entrevista` para
entender o negócio e o mercado (público, oferta, problema e diferença
pretendida). A entrevista também levanta as provas, a personalidade, as
aplicações e as restrições de uso.

Uma marca existente passa primeiro por `brandfy-diagnostico`. Ele confronta o
manual e os assets atuais com a descoberta confirmada e indica o que deve ser
preservado, corrigido ou criado.

## O que precisa de confirmação

Você confirma o nome, o público, a promessa e o posicionamento. Depois aprova
a personalidade, a voz e a direção visual, assim como as aplicações
prioritárias, as licenças e os responsáveis por aprovação. O Brandfy não
completa uma lacuna com uma resposta apenas plausível.

Quando uma resposta ainda estiver aberta, `$brandfy` registra a pergunta,
mostra três caminhos quando a escolha for editorial e aguarda a confirmação
antes de avançar para a próxima especialista.

## O primeiro resultado

O primeiro percurso não entrega apenas uma pasta vazia. Ele deixa uma base
consultável em `.brandfy/`, um `BRAND.md` com as definições confirmadas e um
`brand/README.md` que aponta para os assets e documentos. Conforme o escopo,
as especialistas seguintes completam a estratégia, a voz e a direção visual,
depois os logos, os tokens e os templates, até o manual e a auditoria.
