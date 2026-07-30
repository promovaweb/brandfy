# Logos, webfontes, tokens e templates

## Exporte o sistema de logo

Mantenha os SVGs mestres em `brand/logo/svg/` e execute:

```bash
node .agents/skills/brandfy-ativos-logo/scripts/export-logo.mjs \
  --input brand/logo/svg \
  --output brand/logo/png
```

O exportador produz PNGs a partir das fontes vetoriais e atualiza o manifesto
quando configurado. Os sufixos `light` e `dark` indicam o fundo no qual cada
arquivo será aplicado. Abra uma amostra de cada variante para conferir
transparência, margem, proporção e leitura no tamanho mínimo.

Favicons e avatares pedem uma versão compacta. Uma assinatura horizontal
reduzida até caber em 16 px perde leitura mesmo quando o arquivo continua
tecnicamente válido.

## Prepare as webfontes

Preencha o manifesto de fontes com família, origem, licença, arquivos, pesos e
fallbacks. Depois execute:

```bash
node .agents/skills/brandfy-tipografia-web/scripts/download-fonts.mjs \
  --manifest .brandfy/fonts.json \
  --output brand/fonts
```

O gerador baixa somente arquivos declarados, registra a licença e produz o CSS
tipográfico. Use WOFF2 e `font-display: swap` quando a família permitir. A
ausência da webfont deve acionar o fallback sem esconder conteúdo nem desmontar
a hierarquia.

Antes de versionar uma fonte, confirme que a licença permite redistribuição e
hospedagem própria. Arquivos proprietários permanecem no serviço autorizado ou
no ambiente licenciado.

## Gere os design tokens

A paleta editável fica em `.brandfy/palette.json`. Ela separa famílias de cor
das funções semânticas usadas por websites e sistemas:

```bash
node .agents/skills/brandfy-design-tokens/scripts/generate-tokens.mjs \
  --input .brandfy/palette.json \
  --output brand
```

O comando gera `global.css`, `tokens.json`, `tailwind-theme.js` e
`accessibility.md`. Os tokens semânticos definem fundo, superfície, texto,
texto secundário, borda, acento e foco nos modos light e dark. Cores de sucesso,
aviso e erro podem ser adicionadas quando a interface realmente usa esses
estados.

Importe `brand/global.css` no website. Em Tailwind CSS, aplique o objeto de
`brand/tailwind-theme.js` em `theme.extend`. Prefira os nomes semânticos a
valores hexadecimais copiados para componentes.

## Instale templates de canais

O Brandfy inclui fontes SVG para Instagram, LinkedIn, email e YouTube:

```bash
node .agents/skills/brandfy-templates-canais/scripts/install-templates.mjs \
  --output brand/templates
```

Arquivos existentes são preservados. Use `--force` somente quando a fonte
aprovada deve ser substituída conscientemente. Antes de publicar, aplique a
paleta, as fontes e o logo da marca, remova as guias da exportação e confira a
leitura no tamanho final.

O carrossel usa 1080 por 1350 px, a arte do LinkedIn usa 1200 por 1200 px, o
cabeçalho de email é criado em 1200 por 400 px e a thumbnail do YouTube usa 1280
por 720 px. O banner do canal tem 2560 por 1440 px, mas textos e logos ficam na
área central segura de 1546 por 423 px.
