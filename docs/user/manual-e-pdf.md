# Manual e PDF da marca

## O manual editável

`brandfy-manual` consolida as definições confirmadas em `BRAND.md` e atualiza
`brand/README.md` como índice. O manual reúne a estratégia, o posicionamento e
a voz, a direção visual e as aplicações, além da governança, das lacunas e da
relação dos arquivos.

`BRAND.md` é a fonte editorial: corrija o texto nele, não no PDF. O índice
também não deve repetir o manual inteiro.

## O PDF do projeto consumidor

Quando o manual e os assets estiverem prontos, `$brandfy` chama
`brandfy-guia-pdf`. A especialista instala ou confere o kit de PDF em
`brand/pdf/`, sem substituir personalizações existentes. Depois compila
`brand/brand-guide.pdf` a partir de `BRAND.md`.

O PDF usa A4 com capa clara, Manrope nos títulos e Inter no corpo. Ele traz
sumário, tabelas e blocos de código, com paginação e links internos. O design
system global fica em `brand/pdf/` e inclui as licenças das fontes.

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
