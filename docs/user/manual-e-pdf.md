# Manual e PDF da marca

## O manual editável

`brandfy-manual` consolida as definições confirmadas em `BRAND.md` e atualiza
`brand/README.md` como índice. O manual reúne estratégia, posicionamento, voz,
direção visual, aplicações, governança, lacunas e mapa dos arquivos.

`BRAND.md` é a fonte editorial. O PDF não deve ser corrigido diretamente, e o
índice não deve repetir o manual inteiro.

## O PDF do projeto consumidor

Quando o manual e os assets estiverem prontos, `$brandfy` chama
`brandfy-guia-pdf`. A especialista instala ou confere o kit de PDF em
`brand/pdf/`, sem substituir personalizações existentes, e compila
`brand/brand-guide.pdf` a partir de `BRAND.md`.

O PDF usa A4, capa clara, Manrope nos títulos, Inter no corpo, sumário, tabelas,
blocos de código, paginação e links internos. O design system global fica em
`brand/pdf/` e inclui as licenças das fontes.

## O que conferir na leitura

Abra o PDF depois da compilação e confira:

- capa, nome, descrição, logo e edição;
- sumário e hierarquia dos capítulos;
- quebras de página, tabelas, imagens e blocos de código;
- variantes do logo, contraste, fontes e licenças;
- URLs, rodapé, cabeçalho e propriedades do documento;
- correspondência entre o texto do PDF e `BRAND.md`.

O PDF do Brandfy em `ebooks/` é outro produto: ele contém somente o guia do
usuário do framework. `brand/brand-guide.pdf` é o manual da marca do projeto
consumidor.
