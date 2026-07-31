# Testes e validação

## Suíte principal

Execute na raiz do Brandfy:

```bash
npm test
```

O script roda os testes dos geradores, a suíte em `cli/tests/` e os
validadores estruturais. Os testes do CLI injetam um executor falso, portanto
não usam a rede nem modificam skills instaladas na máquina.

## Cobertura atual

`tests/setup.test.mjs` cria um projeto temporário, executa o setup duas vezes e
confirma que o conteúdo autoral do `AGENTS.md` foi preservado.

`tests/interview.test.mjs` inicializa uma entrevista, comprova falhas de
cobertura, compila uma versão confirmada e verifica a idempotência dos blocos
gerados.

`tests/generators.test.mjs` gera tokens em diretório temporário e instala os
templates sem substituir arquivos. Novos geradores devem receber um teste que
use entradas pequenas e confira conteúdo, não somente a presença da saída.

`cli/tests/cli.test.mjs` confere ajuda, versão, argumentos repassados ao
`skills`, setup, diagnóstico e compilação de PDF. O tarball ainda precisa ser
instalado em um diretório temporário durante a preparação da release, porque
essa verificação exerce o binário exatamente como o npm o distribuirá.

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
rode a verificação. A versão precisa ser igual à de `package.json` e
`cli/package.json`.

## Release

O comando abaixo confere a versão única, a entrada correspondente no changelog
e os arquivos do pacote público:

```bash
npm run release:check
```

O processo completo de publicação está em
[`RELEASING.md`](../../RELEASING.md).

## Inspeção humana

Testes não detectam um logo visualmente deformado, uma tabela quebrada no PDF
ou um capítulo difícil de seguir. Abra amostras dos ativos e leia a
documentação completa depois dos validadores formais.
