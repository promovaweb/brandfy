# CHROMATIC.md

Guia de cores da marca Brandfy. Registra a origem da cor, o esquema do
círculo cromático usado para relacionar as famílias e a decisão final. O
raciocínio técnico completo do círculo cromático está na skill
`brandfy-design-tokens`, em
[`references/circulo-cromatico.md`](skills/brandfy-design-tokens/references/circulo-cromatico.md);
este arquivo guarda o resultado aplicado à Brandfy, não o método.

## Origem da cor

Cor preferida declarada: o turquesa vem do vínculo institucional com a
Promovaweb (mesma família de matiz da marca-mãe), conforme
[`BRAND.md`](BRAND.md#conceito-visual). Não é pesquisa de categoria; é
herança de marca deliberada, para expressar que a Brandfy é uma extensão da
Promovaweb.

## Ajuste técnico pelo círculo cromático

| Campo | Valor |
| --- | --- |
| Matiz-base (primary, turquesa) | 172° |
| Esquema de harmonia | complementar |
| Matiz do acento (accent, coral rosado) | 349° |
| Distância angular obtida | 176,8° (alvo 180° ± 15°, aprovado) |
| Motivo do esquema | O turquesa comunica parentesco institucional. Um complementar dá ao coral o contraste máximo necessário para sinalizar criação, curadoria e destaque sem se confundir com a base institucional. |

Cálculo verificável em `brand/color-harmony.md`, gerado por
`generate-tokens.mjs` a partir de `brand/colors/palette.json`.

## Escala aplicada

`families.primary` (turquesa, matiz 172°) e `families.accent` (coral rosado,
matiz 349°) têm 11 tons cada, de `50` a `950`, em
[`brand/colors/palette.json`](brand/colors/palette.json) — a fonte editável.
Não edite `brand/tokens.json` nem `brand/global.css` diretamente; eles são
saída derivada do gerador.

## Decisão

Aprovado como parte da identidade fundadora da Brandfy (ver histórico em
[`CHANGELOG.md`](CHANGELOG.md)). Esquemas alternativos não foram testados
nesta rodada: o vínculo institucional com o turquesa da Promovaweb já
definia o matiz-base antes da escolha de esquema, então a decisão em aberto
era o esquema de harmonia para o acento, resolvida pela relação
complementar.
