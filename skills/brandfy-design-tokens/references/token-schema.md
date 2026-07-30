# Esquema dos design tokens

`.brandfy/palette.json` separa famílias de origem e funções para os modos
light e dark.

As famílias usam escalas numéricas, como `primary.500` e `neutral.950`. As
funções semânticas usam nomes como `background`, `surface`, `text`,
`textMuted`, `border`, `accent` e `focus`.

O gerador cria:

- `global.css` com custom properties;
- `tokens.json` para outras ferramentas;
- `tailwind-theme.js` para `theme.extend` no Tailwind CSS;
- `accessibility.md` com as proporções de contraste testadas.

Adicione sucesso, aviso, erro e informação quando o sistema usar esses estados.
Não use a cor como único sinal de estado.
