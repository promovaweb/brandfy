# Ebooks da documentação do Brandfy

Esta pasta publica a documentação completa do Brandfy em PDF e EPUB. O conteúdo
é compilado das páginas em `docs/`, enquanto o manual criado para uma marca
cliente é compilado de `brand/README.md` no projeto consumidor e termina em
`brand/brand-guide.pdf`.

Os dois PDFs não compartilham a mesma fonte:

| Artefato | Fonte editável | Destino |
| --- | --- | --- |
| Documentação completa do Brandfy | `brandfy/docs/**/*.md` | `brandfy/ebooks/Brandfy-Documentacao-Completa-v<versão>.pdf` |
| Manual da marca do usuário | `<projeto>/brand/README.md` | `<projeto>/brand/brand-guide.pdf` |

## Edição vigente

A versão do guia do Brandfy está em [`VERSION`](VERSION) e segue SemVer:

- `PATCH` registra correção de texto, link, exemplo ou apresentação.
- `MINOR` registra um capítulo novo ou uma ampliação material.
- `MAJOR` registra uma reorganização incompatível do percurso.

Baixe a edição `v1.1.0` nos dois formatos:

- [PDF da documentação completa](Brandfy-Documentacao-Completa-v1.1.0.pdf).
- [EPUB da documentação completa](Brandfy-Documentacao-Completa-v1.1.0.epub).

Os artefatos do produto seguem estes nomes:

```text
Brandfy-Documentacao-Completa-v<versão>.pdf
Brandfy-Documentacao-Completa-v<versão>.epub
```

Para links permanentes, use os aliases da edição mais recente:

- [PDF vigente](ebook-brandfy.pdf): `ebook-brandfy.pdf`;
- [EPUB vigente](ebook-brandfy.epub): `ebook-brandfy.epub`.

[`build.json`](build.json) registra a versão, o digest das fontes e os hashes
dos dois arquivos.

## Gere os formatos do Brandfy

Na raiz do repositório Brandfy:

```bash
npm run ebook
```

O build exige Pandoc, WeasyPrint, Python, `xmllint`, `pdfinfo`, `pdftotext` e
`unzip`. `docs/reading-order.txt` precisa listar cada página Markdown
exatamente uma vez.

## Confira a edição

```bash
npm run ebook:verify
```

A verificação compara as fontes com o manifesto, recalcula hashes, valida os
documentos XML do EPUB e confirma que o PDF possui páginas e o título
esperado.

Toda mudança pública usa a mesma SemVer em `package.json`,
`cli/package.json` e `ebooks/VERSION`. A release exige novo build, inspeção
visual do PDF, abertura do EPUB e execução da verificação.
