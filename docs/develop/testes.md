# Testes e validação

## Suíte principal

Execute na raiz do Brandfy:

```bash
npm test
```

O script roda `node --test tests/*.test.mjs` e
`node scripts/validate.mjs`. O primeiro grupo exerce comportamento; o segundo
confere a forma pública da biblioteca.

## Cobertura atual

`tests/setup.test.mjs` cria um projeto temporário, executa o setup duas vezes e
confirma que o conteúdo autoral do `AGENTS.md` foi preservado.

`tests/interview.test.mjs` inicializa uma entrevista, comprova falhas de
cobertura, compila uma versão confirmada e verifica a idempotência dos blocos
gerados.

`tests/generators.test.mjs` gera tokens em diretório temporário e instala os
templates sem substituir arquivos. Novos geradores devem receber um teste que
use entradas pequenas e confira conteúdo, não somente a presença da saída.

## Validador estrutural

`scripts/validate.mjs` percorre todas as skills e confere:

- existência de `SKILL.md` e `agents/openai.yaml`;
- correspondência entre frontmatter e diretório;
- extensão da descrição;
- ausência de marcadores `TODO`;
- presença do protocolo de plano e validação;
- postura de especialista;
- chamada `$brandfy-*` nos metadados;
- igualdade do bloco do consumidor com o trecho canônico de `AGENTS.md`;
- presença dos scripts essenciais.

## Documentação e ebook

O comando abaixo confere a ordem das páginas, o manifesto, os hashes, a
estrutura XML do EPUB e a leitura básica do PDF:

```bash
npm run ebook:verify
```

Quando `docs/` muda, incremente `ebooks/VERSION`, execute `npm run ebook` e
rode a verificação. Os guias de uso e desenvolvimento pertencem à mesma edição
portátil.

## Inspeção humana

Testes não detectam um logo visualmente deformado, uma tabela quebrada no PDF
ou um capítulo difícil de seguir. Abra amostras dos ativos e leia a
documentação completa depois dos validadores formais.
