# Contribuindo com o Brandfy

Este guia é para quem vai alterar as skills, os scripts, a documentação ou o
CLI do Brandfy. Para instalar e usar a biblioteca, leia o
[README.md](README.md).

O projeto é escrito em Node.js, sem framework. Ele distribui 19 skills em
Markdown com scripts auxiliares. O CLI publicado como `@promovaweb/brandfy`
vive em `cli/` e usa o gerenciador
[skills](https://github.com/vercel-labs/skills) para instalar o catálogo no
projeto consumidor.

## Antes de começar

- Converse no [Discord](https://promovaweb.com/discord) quando a mudança for
  grande, mudar o contrato de uma skill ou criar uma especialidade nova.
- Abra uma [issue](https://github.com/promovaweb/brandfy/issues) por mudança,
  com o comportamento atual, o esperado e como reproduzir.
- Preserve o que já existe. Mudanças de README, CONTRIBUTING e documentação
  também entram por pull request.

## Ambiente

Requisitos:

- Node.js 22.20 ou posterior.
- `git` e `npm`.
- [ImageMagick](https://github.com/ImageMagick/ImageMagick), exigido por
  `npm test`, porque os testes dos geradores exportam PNG do logo. O workflow
  de CI instala o pacote `imagemagick` antes dos testes.
- [Pandoc](https://github.com/jgm/pandoc),
  [WeasyPrint](https://github.com/Kozea/WeasyPrint), `python3`, `unzip`,
  `xmllint`, `pdfinfo`, `pdftotext` e `fc-match` para `npm run ebook` e
  `npm run ebook:verify`, que geram e conferem o PDF e o EPUB do guia.

Clone e prepare as dependências:

```bash
git clone https://github.com/promovaweb/brandfy.git
cd brandfy
npm --prefix cli ci
```

Rode o CLI direto do código-fonte:

```bash
node cli/bin/brandfy.mjs --help
node cli/bin/brandfy.mjs doctor .
```

Para testar o setup em um diretório descartável, use o exemplo isolado. Ele
grava em `example/`, que está no `.gitignore`:

```bash
npm run setup:example
```

## Organização do código

```text
cli/                  CLI publicado no npm: binário, comandos, projeto e testes
skills/               catálogo instalável, uma pasta por skill
  brandfy/            orquestradora, única porta de entrada
  brandfy-*/          especialistas, cada uma com SKILL.md, agents/ e scripts/
docs/user/            guia do usuário, fonte do PDF e do EPUB
docs/develop/         arquitetura, contratos, geradores e testes
scripts/              validações do repositório e troca de versão
tests/                testes do setup, dos geradores e das entrevistas
ebooks/               PDF, EPUB e versão da edição portátil
brand/                marca do próprio Brandfy, usada como referência
```

A arquitetura completa, com os diretórios gerenciados no projeto consumidor,
está em [docs/develop/arquitetura.md](docs/develop/arquitetura.md). O contrato
de uma skill está em
[docs/develop/contrato-das-skills.md](docs/develop/contrato-das-skills.md).

## Fluxo de trabalho

Uma mudança em skill normalmente alcança cinco arquivos: o script, o
`SKILL.md`, os metadados em `agents/openai.yaml`, a documentação e pelo menos
um teste.

1. Crie a branch a partir de `main`.
2. Leia o `AGENTS.md` do repositório e o `SKILL.md` da skill afetada.
3. Altere o script e o texto da skill juntos. Mensagem de erro e documentação
   precisam descrever o mesmo comportamento.
4. Atualize o guia do usuário quando a mudança altera instalação, sequência de
   uso, comando ou arquivo produzido.
5. Atualize o guia técnico quando muda arquitetura, contrato ou manutenção.
6. Rode a validação completa antes de abrir o pull request.

Ao criar uma skill:

- Verifique se a especialidade não cabe de forma coesa em uma existente.
- Prepare `SKILL.md`, `agents/openai.yaml` e somente os recursos necessários.
- Não copie o manual inteiro para `references/`. Carregue a fonte oficial do
  projeto consumidor.
- Registre a skill na orquestradora `brandfy` para que ela entre na ordem do
  percurso.

## Regras do código

- Escreva em Português do Brasil. Mantenha nomes técnicos em inglês quando
  forem a convenção da ferramenta.
- Documente funções e trechos não óbvios com JSDoc curto, em português.
- Scripts recebem caminhos explícitos, não dependem do diretório atual e são
  idempotentes. Preserve arquivos autorais do usuário.
- Separe fato, comprovação, hipótese, preferência, escolha e pendência no texto
  das skills.
- Não grave dados de uma marca cliente em `skills/` nem em `brand/` deste
  repositório.
- Nunca edite à mão o bloco gerenciado do `AGENTS.md` no projeto consumidor.
  Ele é gerado por `brandfy-setup` a partir de
  `skills/brandfy-setup/references/agents-consumer.md`.
- Respeite as WCAG no contraste de texto e componentes. O logo tem exceção
  normativa. As demais peças não têm.

## Validar

A validação completa, a mesma do workflow de CI:

```bash
npm test
npm run release:check
```

`npm test` roda os testes do setup, dos geradores, das entrevistas e do ebook,
os testes do CLI, `scripts/validate.mjs` e `scripts/validate-docs.mjs`.

Comandos auxiliares:

```bash
npm run cli:test        # testes do CLI
npm run validate        # skills, metadados e arquivos obrigatórios
npm run docs:check      # navegação e links do guia do usuário
npm run ebook           # gera PDF e EPUB do guia do usuário
npm run ebook:verify    # confere os artefatos gerados
npm run cli:pack        # dry-run do pacote npm
```

Cada página nova em `docs/user/` precisa entrar uma única vez em
`docs/user/reading-order.txt`. Uma página esquecida reprova `npm run
docs:check` e o build do ebook.

Valide também cada skill alterada com o `quick_validate.py` do Skill Creator:

```bash
python3 /caminho/para/skill-creator/scripts/quick_validate.py skills/brandfy-voz
```

## Documentação

| Onde | O que cobre |
| --- | --- |
| `README.md` | instalação, primeiros passos e uso |
| `docs/user/` | percurso completo do usuário, publicado em PDF e EPUB |
| `docs/develop/` | arquitetura, contratos, geradores, testes e manutenção |
| `CHANGELOG.md` | mudanças públicas por versão |
| `RELEASING.md` | contrato de versão e publicação |

O guia do usuário mantém a fonte editorial em Markdown. O PDF e o EPUB são
gerados dela, nunca editados à mão. Depois de alterar `docs/user/`, rode
`npm run ebook` e `npm run ebook:verify`.

O guia técnico fica online e não entra nos artefatos portáteis.

## Commits e pull requests

Commits seguem o padrão `tipo: resumo curto`, por exemplo:

```text
docs: reorganiza README e CONTRIBUTING no padrão da Promovaweb
feat: adiciona conferência de contraste em brandfy-auditoria
fix: corrige caminho do lock em brandfy update
```

Os tipos usuais são `feat`, `fix`, `docs`, `test`, `chore` e `release`.

Um pull request precisa trazer:

- o problema e o comportamento esperado;
- a issue relacionada, quando existir;
- o que mudou no contrato da skill, se mudou;
- os comandos de validação executados e o resultado;
- o diff conferido, sem arquivo gerado por engano.

## Releases

O framework, o CLI e a documentação portátil usam a mesma SemVer. O
`package.json` da raiz é a fonte local da versão, repetida em
`cli/package.json`, `cli/package-lock.json`, `ebooks/VERSION`, no
`CHANGELOG.md`, na tag `v<versão>`, na GitHub Release e no pacote npm.

```bash
npm run version:set -- 1.4.0
npm run ebook
npm test
npm run ebook:verify
npm run release:check
npm run cli:pack
```

Depois do commit, crie a tag anotada e a GitHub Release com a mesma versão. A
publicação da release dispara `.github/workflows/release.yml`, que valida a
tag e publica o pacote no npm com provenance quando aquela versão ainda não
existe. O passo a passo está em [RELEASING.md](RELEASING.md).

## Licença

O Brandfy é distribuído sob a licença [MIT](LICENSE). Ao contribuir, você
concorda que a sua alteração entra sob os mesmos termos.
