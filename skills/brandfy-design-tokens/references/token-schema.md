# Esquema dos design tokens

`.brandfy/palette.json` separa famílias de origem e funções para os modos
light e dark.

As famílias usam escalas numéricas, como `primary.500` e `neutral.950`. As
funções semânticas usam nomes como `background`, `surface`, `text`,
`textMuted`, `border`, `accent` e `focus`.

Um campo opcional `harmony` registra a relação de círculo cromático entre
`families.primary.500` e `families.accent.500`:

```json
{
  "harmony": { "scheme": "complementar", "baseHue": 174, "accentHue": 354 }
}
```

`scheme` é um dos esquemas de
[circulo-cromatico.md](circulo-cromatico.md):
`monocromatica | analoga | complementar | split-complementar | triade |
tetradica`. Quando presente, o gerador recalcula o matiz real de
`primary.500` e `accent.500` e reprova a paleta se a distância angular fugir
da tolerância do esquema declarado.

O gerador cria:

- `global.css` com custom properties;
- `tokens.json` para outras ferramentas;
- `tailwind-theme.js` para `theme.extend` no Tailwind CSS;
- `accessibility.md` com as proporções de contraste testadas;
- `color-harmony.md` com a distância angular testada, quando `harmony`
  estiver presente.

Adicione sucesso, aviso, erro e informação quando o sistema usar esses estados.
Não use a cor como único sinal de estado.
