# Assets digitais

## Produção coordenada

Depois da aprovação da estratégia e da direção visual, `$brandfy` chama as
especialistas de produção na ordem necessária. A pessoa usuária não precisa
executar exportadores ou recompiladores individualmente.

## Tipografia

`brandfy-tipografia-web` seleciona webfontes licenciadas e registra pesos e
fallbacks, além da hierarquia e do CSS. O resultado deve apontar para os
arquivos de fonte, a licença e o uso esperado em `BRAND.md`.

## Logo

`brandfy-logo` define o conceito, o símbolo e a assinatura com suas variantes.
Também fixa a área livre, o tamanho mínimo e os usos inadequados.
`brandfy-ativos-logo` exporta a versão aprovada nos formatos de uso (SVG, PNG,
favicon e avatar) com manifesto e preserva a fonte editável.

Antes da auditoria, o agente abre os arquivos exportados para conferir a
proporção, as bordas e a transparência, assim como o fundo, o tamanho mínimo e
a legibilidade.

## Tokens e círculo cromático

`brandfy-design-tokens` transforma as escolhas visuais em tokens reutilizáveis.
Ele produz CSS, JSON e tema Tailwind, além de registrar estados e combinações
de contraste. Componentes devem consumir tokens sem copiar valores isolados.

A cor de origem não é escolhida por gosto do agente. Ela vem de pesquisa de
referência ou de preferência declarada pela pessoa responsável pela marca. Depois, é
ajustada tecnicamente pelo círculo cromático. Um esquema de harmonia relaciona
`primary` e `accent` pela distância angular de matiz, não por combinação
arbitrária. Os esquemas possíveis são:

- monocromático, análogo ou complementar;
- split-complementar, tríade ou tetrádico.

`CHROMATIC.md`, na raiz do projeto, registra essa
origem, o esquema escolhido e a escolha final.

## Templates e aplicações

`brandfy-aplicacoes` define quais peças precisam existir e indica o canal, o
formato e a situação de cada uma. `brandfy-templates-canais` instala modelos
editáveis para Instagram, LinkedIn, email e YouTube. Cada modelo traz zona
segura e campos variáveis, com as dimensões e um exemplo.

Para cada aplicação, o manual registra o template, a variante do logo e os
tokens usados, junto com a saída exportada. Com esse registro, outro agente
retoma a produção sem reconstruir a intenção visual.

## Arquivos e fontes

O arquivo-fonte fica junto das exportações. Cada asset gerado recebe um
manifesto com dimensão e formato, licença e origem. A auditoria reprova o
conjunto quando só existe o PNG final, quando a fonte editável desapareceu ou
quando `BRAND.md` aponta para um caminho que não existe.
