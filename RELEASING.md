# Releases do Brandfy

Cada release usa a mesma SemVer no framework, no pacote npm e na documentação
portátil. A tag Git recebe o prefixo `v`, enquanto os arquivos guardam somente
o número, como `1.1.0`.

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
repositório:

```bash
git commit -am "release: Brandfy v1.2.0"
git tag -a v1.2.0 -m "Brandfy v1.2.0"
git push origin main
git push origin v1.2.0
```

Publique o diretório `cli/` no npm:

```bash
npm --prefix cli publish --access public
```

Por fim, crie a GitHub Release com as notas correspondentes à seção da versão
no changelog:

```bash
gh release create v1.2.0 --verify-tag --title "Brandfy v1.2.0" \
  --notes-file <arquivo-de-notas>
```

O workflow de release tenta publicar o pacote com provenance somente quando a
versão ainda não existe no npm. Isso permite criar a GitHub Release depois de
uma publicação manual sem gerar uma segunda versão.
