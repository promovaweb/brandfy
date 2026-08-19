# Uso da marca por agentes

## Dê ao agente uma fonte única

O setup inclui no `AGENTS.md` um bloco que orienta o uso de `.brandfy/` e
`brand/`. Preserve os marcadores porque uma execução posterior atualiza
somente esse trecho. Instruções específicas do projeto continuam fora do
bloco.

Antes de criar uma peça, o agente deve ler `.brandfy/config.yaml`, `BRAND.md`,
o índice e
os arquivos ligados ao canal. Para uma arte social, isso inclui os tokens, o
logo apropriado e o guia do template. Para um texto, inclui a estratégia, a voz
e os exemplos do canal.

## Escreva instruções verificáveis

Uma solicitação útil nomeia a entrada, o canal e a saída. A porta de entrada
continua sendo `$brandfy`; os nomes abaixo ajudam a explicar qual especialista
será acionada internamente:

```text
Use $brandfy para preparar um carrossel de Instagram a partir do template
aprovado. Leia BRAND.md, brand/README.md e brand/templates/README.md, preserve a
zona segura, salve o SVG editável e abra o PNG final em 1080 × 1350.
```

O agente precisa relatar quais arquivos leu, quais arquivos criou, que
conferências executou e o que permaneceu pendente. Uma resposta que apenas
afirma fidelidade à marca sem apontar o manual e o arquivo resultante não
oferece evidência suficiente.

## Preserve ativos aprovados

Uma nova execução não deve redesenhar o logo, trocar fontes ou substituir um
template aprovado para atender uma peça isolada. Quando a aplicação revela uma
limitação do sistema, registre o achado e encaminhe a revisão à skill
especialista.

Fotografias institucionais dependem de arquivo autorizado. Uma imagem gerada
não substitui o retrato oficial de uma pessoa. Toda fonte, ilustração ou
elemento externo precisa manter autoria, licença e procedência.

## Confira a exportação

O arquivo editável e a exportação cumprem funções diferentes. O SVG permite
revisão futura; o PNG mostra como a peça chega ao canal. Peça ao agente para
abrir a exportação no tamanho final, testar contraste e confirmar que guias,
placeholders e conteúdo reservado foram removidos.
