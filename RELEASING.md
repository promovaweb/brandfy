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
git push --atomic origin HEAD:main v1.2.0
```

Crie a GitHub Release manualmente, usando a mesma tag. Nenhum workflow é
disparado por essa publicação:

```bash
gh release create v1.2.0 --verify-tag --title "Brandfy v1.2.0" \
  --notes-file <arquivo-de-notas>
```

O pacote npm é publicado somente pela máquina local, nunca pelo GitHub
Actions. O repositório não guarda `NPM_TOKEN`. Depois que a GitHub Release
existir, gere o tarball do CLI no commit da tag e publique esse arquivo,
logado no npm como `contatopromovaweb`:

```bash
git checkout v1.2.0
npm --prefix cli ci
npm run release:check
npm pack ./cli --pack-destination /tmp
sha256sum /tmp/promovaweb-brandfy-1.2.0.tgz
npm publish /tmp/promovaweb-brandfy-1.2.0.tgz --access public
git checkout main
```

A release não anexa tarball nem `SHA256SUMS`. Por isso, o tarball publicado
é sempre o gerado no commit da tag. Confira as duas publicações remotas. O npm
pode levar alguns minutos para mostrar a versão nova:

```bash
npm view @promovaweb/brandfy@1.2.0 version license
gh release view v1.2.0 --json tagName,isDraft,isPrerelease
```

A release só está completa quando o npm mostra a mesma versão da tag.
