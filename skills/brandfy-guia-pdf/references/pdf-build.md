# Compilação do guia em PDF

O compilador requer `pandoc` e `weasyprint` disponíveis no `PATH`.

O Pandoc transforma o Markdown em HTML semântico, cria o sumário e incorpora
os recursos locais. O WeasyPrint aplica o CSS de impressão e produz o PDF.

Mantenha imagens e fontes dentro do diretório da marca ou use caminhos
relativos alcançáveis a partir de `BRAND.md`. Depois da compilação,
confira capa, sumário, links, quebras, tabelas, SVGs, PNGs, cabeçalhos, rodapés
e metadados.

O kit distribuído fica em `assets/pdf-design-system/` e é copiado para
`brand/pdf/` do projeto consumidor. Use `--install-assets` para copiar somente
arquivos ausentes. Use `--force-assets` apenas quando a atualização tiver sido
revisada e precisar substituir as cópias locais.

Nome, logo, descrição, tagline e cor de link podem variar. Formato A4, capa
clara, grade, escala tipográfica, Inter, Manrope, sumário, tabelas, código e
paginação pertencem ao contrato global. O Markdown continua sendo a fonte de
conteúdo.
