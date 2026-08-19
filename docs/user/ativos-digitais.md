# Assets digitais

## Produção coordenada

Depois da aprovação da estratégia e da direção visual, `$brandfy` chama as
especialistas de produção na ordem necessária. A pessoa usuária não precisa
executar exportadores ou recompiladores individualmente.

## Tipografia

`brandfy-tipografia-web` seleciona webfontes licenciadas, registra pesos,
fallbacks, hierarquia e CSS. O resultado deve apontar para os arquivos de fonte,
a licença e o uso esperado em `BRAND.md`.

## Logo

`brandfy-logo` define conceito, símbolo, assinatura, variantes, área livre,
tamanho mínimo e usos inadequados. `brandfy-ativos-logo` transforma a versão
aprovada em SVG, PNG, favicon, avatar e manifesto, preservando a fonte editável.

O agente deve abrir os arquivos exportados e conferir proporção, bordas,
transparência, fundo, tamanho mínimo e legibilidade antes da auditoria.

## Tokens

`brandfy-design-tokens` transforma as escolhas visuais em tokens reutilizáveis.
Ele produz CSS, JSON e tema Tailwind, além de registrar estados e combinações
de contraste. Componentes devem consumir tokens sem copiar valores isolados.

## Templates e aplicações

`brandfy-aplicacoes` define quais peças precisam existir, para qual canal,
formato e situação. `brandfy-templates-canais` instala modelos editáveis para
Instagram, LinkedIn, email e YouTube, com zona segura, campos variáveis,
dimensões e exemplos.

O manual registra a relação entre cada aplicação, o template, a variante do
logo, os tokens e a saída exportada. Isso permite que outro agente retome a
produção sem reconstruir a intenção visual.

## Arquivos e fontes

O arquivo-fonte é preservado junto das exportações. Assets gerados recebem
manifesto, dimensão, formato, licença e origem. A auditoria reprova um pacote
quando só existe o PNG final, quando a fonte editável desapareceu ou quando
`BRAND.md` aponta para um caminho que não existe.
