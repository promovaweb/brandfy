---
name: brandfy-guia-pdf
description: Compila o manual Markdown editável em um PDF de marca. Use para gerar ou recompilar o guia após alterações no README ou nos ativos.
---

# Compilar o guia da marca em PDF

## Protocolo operacional

- **Plano e progresso:** planejar fonte, tema, compilação e inspeção.
- **Fontes de verdade:** ler `brand/README.md`, os ativos vinculados e
  [pdf-build.md](references/pdf-build.md).
- **Escopo e idempotência:** gerar o PDF a partir do Markdown sem modificar a
  fonte editável.
- **Validação:** recompilar, conferir links, páginas, imagens, fontes, sumário e
  metadados.
- **Resumo final:** informar fonte, PDF, ferramentas usadas e avisos.

## Fluxo

1. Confirmar que `brand/README.md` é a versão aprovada e que os links relativos
   existem.
2. Executar:

   ```bash
   node <caminho-da-skill>/scripts/build-brand-guide.mjs \
     --input brand/README.md \
     --output brand/brand-guide.pdf
   ```

3. O compilador usa Pandoc para gerar HTML semântico e WeasyPrint para produzir
   o PDF. Instalar essas ferramentas quando a verificação inicial apontar
   ausência.
4. Ajustar o tema em `assets/brand-guide.css` quando a marca exigir outra
   paleta, tipografia ou formato de página.
5. Abrir o PDF e conferir capa, sumário, quebras, tabelas, SVGs, PNGs, URLs,
   cabeçalhos, rodapés e propriedades do documento.
6. Recompilar sempre que o Markdown, o CSS, uma fonte ou um ativo vinculado
   mudar.

Quando uma imagem, uma tabela ou um texto aparecer errado no PDF, corrija
`brand/README.md`, o CSS ou o ativo vinculado. Recompile e abra a página
afetada para confirmar o ajuste sem editar o PDF diretamente.

## Raciocínio do especialista

Tratar o PDF como uma representação da fonte canônica, não como documento
independente. Avaliar legibilidade, navegação, sequência pedagógica,
reprodução, acessibilidade e rastreabilidade dos ativos. Uma compilação sem
erro técnico ainda falha quando oculta exemplos, separa regra do contexto ou
torna tabelas ilegíveis.
