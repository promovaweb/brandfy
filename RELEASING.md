# Releases do Brandfy

## Contrato de versão única

Uma release do Brandfy só está completa quando o mesmo número SemVer aparece
em todas as superfícies públicas. O `package.json` da raiz é a fonte da versão
local. O valor precisa ser repetido em:

- `cli/package.json` e `cli/package-lock.json`;
- `ebooks/VERSION`, no PDF e no EPUB gerados;
- uma seção `## [<versão>]` no `CHANGELOG.md`;
- a tag Git `v<versão>`;
- a GitHub Release associada à tag `v<versão>`;
- o pacote npm `@promovaweb/brandfy@<versão>`.

A ausência do changelog, da GitHub Release ou do pacote npm deixa a release
incompleta, mesmo quando o commit e a tag já existem. A tag recebe o prefixo
`v`, enquanto os arquivos e o npm guardam somente o número, como `1.2.0`.

## Preparação

Escolha a próxima versão conforme SemVer e aplique-a em todas as superfícies:

```bash
npm run version:set -- 1.2.0
```

Atualize `CHANGELOG.md`, gere a documentação e execute a validação completa:

```bash
npm run ebook
npm test
npm run ebook:verify
npm run release:check
npm run cli:pack
```

O tarball precisa ser instalado em um diretório temporário. Nessa instalação,
confira `brandfy --version`, `brandfy --help` e `brandfy doctor`.

## Publicação

Crie um commit exclusivo da release, a tag anotada e envie ambos ao
repositório. O número da tag precisa ser o mesmo número conferido pelos
comandos anteriores:

```bash
git commit -am "release: Brandfy v1.2.0"
git tag -a v1.2.0 -m "Brandfy v1.2.0"
git push origin main
git push origin v1.2.0
```

Crie a GitHub Release usando a mesma tag. Essa publicação dispara o workflow
`.github/workflows/release.yml`, que executa `npm run release:check`, confere a
tag da GitHub Release e publica o CLI no npm quando aquela versão ainda não
existe:

```bash
gh release create v1.2.0 --verify-tag --title "Brandfy v1.2.0" \
  --notes-file <arquivo-de-notas>
```

Depois do workflow, confira as duas publicações remotas:

```bash
npm view @promovaweb/brandfy@1.2.0 version
gh release view v1.2.0 --json tagName,isDraft,isPrerelease
```

O workflow usa provenance no npm. Se o pacote já existir, ele não tenta uma
segunda publicação. Ainda assim, a GitHub Release precisa existir e usar a
mesma tag da versão publicada.
