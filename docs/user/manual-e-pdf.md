# Manual editável e PDF da marca

## O Markdown é a fonte

O manual canônico vive em `brand/README.md`. Ele liga a estratégia aos
arquivos e explica como designers, redatores, desenvolvedores e agentes devem
usar a marca. Corrija o Markdown e recompile o PDF; não faça uma correção
isolada no arquivo binário.

Um manual completo cobre origem, estratégia, posicionamento, personalidade,
voz, logo, cor, tipografia, imagens, aplicações, acessibilidade, licenças e
governança. Os links relativos precisam apontar para arquivos que existam
dentro da pasta da marca.

## Compile o guia

Com Pandoc e WeasyPrint disponíveis no `PATH`, execute:

```bash
node .agents/skills/brandfy-guia-pdf/scripts/build-brand-guide.mjs \
  --project . \
  --input brand/README.md \
  --output brand/brand-guide.pdf \
  --brand-name "Nome da marca"
```

Antes da compilação, a skill copia CSS, template, Inter, Manrope e licenças
para `brand/pdf/`. Arquivos locais existentes são preservados. O Pandoc
converte o Markdown para HTML, cria o sumário e incorpora recursos locais. O
WeasyPrint aplica o CSS e produz o PDF.

Para instalar o kit sem compilar:

```bash
node .agents/skills/brandfy-guia-pdf/scripts/build-brand-guide.mjs \
  --project . \
  --install-assets
```

Use `--force-assets` somente para atualizar deliberadamente a cópia local.

## Abra o resultado

Uma compilação sem erro não comprova a qualidade visual. Abra a capa, o
sumário, páginas com tabela, páginas com imagens e a última página. Confirme as
fontes, a numeração, as quebras, a proporção dos logos e os links.

Quando uma imagem não aparece, confira o caminho relativo a
`brand/README.md`. Quando a fonte não carrega, confirme a URL no CSS e a
licença ao lado do arquivo. Tabelas extensas podem exigir uma redação mais
compacta ou outra disposição, mas o Markdown continua sendo a origem.

## Diferencie os dois PDFs

O PDF em `brand/brand-guide.pdf` é o manual da identidade de um projeto
consumidor e é compilado de `brand/README.md` dentro desse projeto. O PDF em
`brandfy/ebooks/` pertence ao repositório do Brandfy e é a edição portátil
deste guia de uso. Eles possuem fontes, destinos e públicos diferentes, mas
usam o mesmo `pdf-design-system: 1.0.0`.
