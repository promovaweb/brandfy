# Kit global para PDFs

Este diretório implementa o contrato de `PDFS.md`. A versão atual é `1.0.0` e
reproduz a composição editorial compartilhada pelos ebooks do Specsfy e do
ClickUpfy com as fontes oficiais do Hub.

## Arquivos

| Caminho | Função |
| --- | --- |
| `pdf.css` | Estilos canônicos para impressão A4 |
| `template.html` | Template Pandoc com capa, sumário e corpo |
| `fonts/` | Webfonts locais e licenças OFL |
| `pipelines.json` | Registro dos pipelines de PDF auditados |

## Variáveis do template

O template aceita `title`, `brand_name`, `document_type`, `tagline`,
`description`, `version`, `date`, `source_label`, `logo` e `footer_label`.
Somente `title` é indispensável; os demais campos possuem tratamento
condicional.

Exemplo:

```bash
pandoc brand/README.md \
  --from=gfm \
  --to=html5 \
  --standalone \
  --toc \
  --template=brand/pdf/template.html \
  --css=brand/pdf/pdf.css \
  --variable=brand_name:"Nome da marca" \
  --variable=document_type:"Manual da marca" \
  --variable=logo:"brand/logo/svg/icon.svg" \
  --output=/tmp/manual.html
```

O compilador precisa usar `brand/pdf/` como `resource-path` ou informar sua
raiz como base para que fontes, logo e imagens sejam incorporados.

## Extensão segura

Crie um segundo CSS depois de `pdf.css` quando precisar mudar uma cor semântica
ou um detalhe específico. Não copie o arquivo inteiro. A capa permanece clara,
a grade A4 e a escala tipográfica não mudam, e Inter/Manrope continuam sendo as
famílias oficiais.
