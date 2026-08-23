# Círculo cromático como base científica da paleta

O Brandfy escolhe cor de marca a partir do círculo cromático, não por
preferência isolada. O círculo organiza o matiz (hue) em 360°. Distância
angular entre matizes é o que sustenta ou rompe uma combinação. Saturação e
luminosidade ajustam intensidade e peso, mas não substituem a relação
angular.

## Modelo

Trabalhe em HSL (Hue, Saturation, Lightness):

- **Matiz (H)**: posição em graus no círculo, de 0° a 360°. `0`/`360` é
  vermelho, `120` é verde, `240` é azul.
- **Saturação (S)**: pureza do matiz, de `0%` (cinza) a `100%` (cor plena).
- **Luminosidade (L)**: mistura com preto ou branco, de `0%` (preto) a `100%`
  (branco).

Toda cor de origem em `palette.json` (`primary.500`, `accent.500`, `neutral`)
tem um matiz calculável. O gerador usa esse matiz para relacionar as famílias
entre si.

## Esquemas de harmonia

| Esquema | Relação angular | Efeito | Uso típico |
| --- | --- | --- | --- |
| Monocromática | mesmo matiz, S/L variam | unidade máxima, baixo contraste cromático | marca que já resolve contraste por tipografia e composição |
| Análoga | matizes vizinhos, `±30°` | harmonia natural, transição suave | marca que evita tensão visual entre `primary` e `accent` |
| Complementar | matizes opostos, `180° ± 15°` | contraste máximo, alto impacto | acento que precisa competir com o fundo e chamar ação |
| Split-complementar | base e os dois vizinhos do oposto, `150°`/`210°` | contraste com menos tensão que a complementar pura | acento vibrante sem o choque da complementar direta |
| Tríade | três matizes a `120°` entre si | equilíbrio com variedade, exige uma cor dominante | sistemas com três famílias funcionais (`primary`, `accent`, estado) |
| Tetrádica (retangular) | dois pares complementares, `60°`/`180°`/`240°` | paleta rica, exige hierarquia clara de dominância | sistemas grandes com múltiplas famílias de estado |

Escolha um esquema antes de fixar hex. Registre o esquema e o matiz-base em
`palette.json` no campo `harmony`:

```json
{
  "harmony": {
    "scheme": "complementar",
    "baseHue": 174
  }
}
```

O `baseHue` é o matiz de `families.primary.500`. `scheme` é um dos valores da
tabela acima, em minúsculas e sem acento:
`monocromatica | analoga | complementar | split-complementar | triade | tetradica`.

## Escala numérica (tints e shades)

Uma família (`50` a `950`) mantém o matiz fixo e varia luminosidade, com leve
ajuste de saturação nas pontas para evitar cinza lavado no `50` e preto puro
no `950`:

| Passo | L alvo | S relativa ao `500` |
| --- | --- | --- |
| 50 | 95% | -15% |
| 100 | 90% | -10% |
| 200 | 80% | -5% |
| 300 | 70% | 0% |
| 400 | 60% | 0% |
| 500 | valor de origem | valor de origem |
| 600 | 40% | +5% |
| 700 | 30% | +5% |
| 800 | 22% | 0% |
| 900 | 14% | -5% |
| 950 | 8% | -10% |

Use `scripts/gerar-paleta-cromatica.mjs` para aplicar essa tabela a partir de
uma cor-base e de um esquema, em vez de escolher os 11 tons um a um.

## O que o círculo cromático não decide

Contraste de acessibilidade, distinção entre estados (sucesso, aviso, erro,
info) e legibilidade em fundo fotográfico continuam exigindo os testes de
[visual-system.md](../../brandfy-identidade-visual/references/visual-system.md)
e o relatório de `accessibility.md`. O círculo cromático decide a relação
entre matizes; a validação de tokens decide se essa relação funciona como
interface.
