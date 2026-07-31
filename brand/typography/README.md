# Tipografia da Brandfy

## Famílias

- **Manrope**: títulos, chamadas e wordmark editável; pesos 500 a 800.
- **Inter**: interface, texto corrido e dados; pesos 400 a 700.
- **JetBrains Mono**: código e comandos, com fallback local quando indisponível.

As versões latinas de Manrope e Inter estão em `../fonts/`. A Manrope também
possui o arquivo variável `manrope-variable.ttf`, usado para rasterizar o
wordmark sem depender das fontes instaladas no sistema. Ambas usam a SIL Open
Font License, preservada nos arquivos `OFL-*.txt`.

## Escala para interfaces

| Token | Tamanho/linha | Peso | Uso |
| --- | ---: | ---: | --- |
| `display` | 56/64 px | 750 | Aberturas amplas |
| `h1` | 40/48 px | 750 | Título principal |
| `h2` | 32/40 px | 700 | Seções |
| `h3` | 24/32 px | 700 | Subseções e cards |
| `body-lg` | 18/30 px | 400 | Introduções |
| `body` | 16/26 px | 400 | Texto corrente |
| `small` | 14/22 px | 500 | Metadados |
| `code` | 14/22 px | 500 | Código |

Em telas estreitas, use `display` em 44/52 px e `h1` em 36/44 px. Não use
texto corrido abaixo de 16 px.
