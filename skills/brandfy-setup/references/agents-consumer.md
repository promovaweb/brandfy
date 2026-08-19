<!-- brandfy:consumer:start -->
## Brandfy no projeto

O diretório `.brandfy/` guarda o briefing, a configuração e as comprovações da
marca em construção. `BRAND.md` é o guia completo da marca na raiz do projeto,
`brand/README.md` é o índice operacional e o diretório configurado em
`.brandfy/config.yaml` guarda os assets finais.

Ao criar ou alterar a marca:

1. Leia `.brandfy/config.yaml`, `.brandfy/brief.md` e os artefatos existentes.
2. Use `$brandfy` quando as respostas necessárias ainda não estiverem
   confirmadas; a orquestradora chama a especialista de entrevista.
3. Se existir `MVP.md` na raiz, `$brandfy` chama internamente `$brandfy-mvp` antes da entrevista.
   O importador deve preencher tudo que o MVPFy já respondeu e listar somente
   as lacunas restantes.
4. Preserve arquivos aprovados e registre a origem dos novos elementos.
5. Diferencie fato, comprovação, hipótese, preferência, escolha e pendência.
6. Atue como especialista da etapa, explique parâmetros e apresente tensões
   antes de recomendar uma direção.
7. A pessoa usuária chama somente `$brandfy`; ela coordena internamente as skills `brandfy-*` instaladas no projeto.
8. Não trate busca de nome, domínio ou marca como garantia jurídica.
9. Exporte logo em SVG e PNG, com variações para fundos claros, escuros,
   monocromáticos e espaços compactos.
10. Valide contraste, legibilidade, área de proteção, tamanho mínimo, licenças,
   consentimentos e consistência entre o manual e os arquivos finais.
11. Atualize `BRAND.md`, o índice `brand/README.md` e o manifesto de assets;
    registre qualquer pendência no relatório
    de auditoria da marca.
12. Compile manuais com o kit em `brand/pdf/`; preserve o contrato
    `pdf-design-system: 1.0.0` e não edite o PDF diretamente.
<!-- brandfy:consumer:end -->
