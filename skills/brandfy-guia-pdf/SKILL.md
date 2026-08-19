---
name: brandfy-guia-pdf
description: Compila o guia BRAND.md em um PDF de marca. Use para gerar ou recompilar o guia após alterações no manual ou nos ativos.
---

# Compilar o guia da marca em PDF

## Protocolo operacional

- **Plano e progresso:** planejar fonte, tema, compilação e inspeção.
- **Fontes de verdade:** ler `BRAND.md`, `brand/README.md` como índice, os ativos vinculados e
  [pdf-build.md](references/pdf-build.md).
- **Escopo e idempotência:** copiar o design system para `brand/pdf/` e gerar
  o PDF sem modificar a fonte editável nem substituir personalizações.
- **Validação:** recompilar, conferir links, páginas, imagens, fontes, sumário e
  metadados.
- **Resumo final:** informar fonte, PDF, ferramentas usadas e avisos.

## Fluxo

1. Confirmar que `BRAND.md` é a versão aprovada e que os links relativos
   existem.
2. Instalar ou conferir os ativos locais:

   ```bash
   node <caminho-da-skill>/scripts/build-brand-guide.mjs \
     --project . \
     --install-assets
   ```

   O comando copia CSS, template, Inter, Manrope e licenças para `brand/pdf/`.
   Arquivos existentes são preservados. Use `--force-assets` somente depois de
   revisar as diferenças da versão instalada.
3. Compilar:

   ```bash
   node <caminho-da-skill>/scripts/build-brand-guide.mjs \
     --project . \
     --input BRAND.md \
     --output brand/brand-guide.pdf \
     --brand-name "Nome da marca"
   ```

4. O compilador usa Pandoc para gerar HTML semântico e WeasyPrint para produzir
   o PDF. Instalar essas ferramentas quando a verificação inicial apontar
   ausência.
5. Preservar o contrato `pdf-design-system: 1.0.0`: A4, capa clara, Manrope,
   Inter, sumário, componentes editoriais e paginação. Nome, logo, descrição,
   tagline e cor de link podem ser personalizados sem duplicar o tema.
6. Abrir o PDF e conferir capa, sumário, quebras, tabelas, SVGs, PNGs, URLs,
   cabeçalhos, rodapés e propriedades do documento.
7. Recompilar sempre que o Markdown, o CSS, uma fonte ou um ativo vinculado
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
