# Compilação do guia em PDF

O compilador requer `pandoc` e `weasyprint` disponíveis no `PATH`.

O Pandoc transforma o Markdown em HTML semântico, cria o sumário e incorpora
os recursos locais. O WeasyPrint aplica o CSS de impressão e produz o PDF.

Mantenha imagens e fontes dentro do diretório da marca ou use caminhos
relativos alcançáveis a partir de `brand/README.md`. Depois da compilação,
confira capa, sumário, links, quebras, tabelas, SVGs, PNGs, cabeçalhos, rodapés
e metadados.

Edite `assets/brand-guide.css` para ajustar formato da página, margens, cores e
tipografia. O Markdown continua sendo a fonte de conteúdo.
