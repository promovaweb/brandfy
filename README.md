# Brandfy

O Brandfy é uma biblioteca de skills para construir uma marca ou organizar uma
identidade existente. O trabalho produz um manual que designers, redatores,
desenvolvedores e agentes conseguem consultar para criar novos arquivos e
conferir se eles continuam fiéis à marca.

## Instalação

Instale todas as skills no projeto atual com o gerenciador oficial:

```bash
npx skills add promovaweb/brandfy
```

Depois, invoque `$brandfy-setup`. A skill cria a configuração em `.brandfy/`,
prepara o diretório `brand/` e integra um bloco idempotente ao `AGENTS.md` do
projeto. Para executar o script diretamente:

```bash
node .agents/skills/brandfy-setup/scripts/setup.mjs --project .
```

O destino pode variar conforme o agente escolhido pelo `skills add`. Use o
caminho real no qual a skill foi instalada.

## Fluxos principais

`$brandfy-builder` coordena a construção completa. Uma marca já existente pode
começar por `$brandfy-diagnostico` e seguir apenas pelas etapas que precisam de
revisão. As skills especializadas também funcionam de forma direta:

| Skill | Responsabilidade |
| --- | --- |
| `brandfy-setup` | Prepara `.brandfy/`, `brand/` e as instruções do projeto. |
| `brandfy-builder` | Coordena a esteira completa e mantém os marcos de aceite. |
| `brandfy-diagnostico` | Inventaria materiais, procedência, lacunas e prioridades. |
| `brandfy-estrategia` | Define propósito, missão, visão, valores, princípios e personalidade. |
| `brandfy-naming` | Pesquisa nomes, disponibilidade indicativa e possíveis conflitos. |
| `brandfy-slogan` | Desenvolve slogans e testa entendimento, sonoridade e uso. |
| `brandfy-voz` | Documenta voz, tons, vocabulário, mensagens e exemplos. |
| `brandfy-identidade-visual` | Define direção visual, cores, tipografia, imagens e iconografia. |
| `brandfy-logo` | Conduz conceitos originais e a criação do sistema de logo. |
| `brandfy-ativos-logo` | Exporta SVG, PNG, favicons, avatares e manifestos. |
| `brandfy-design-tokens` | Produz tokens CSS e JSON com combinações acessíveis. |
| `brandfy-tipografia-web` | Documenta a hierarquia, baixa webfontes licenciadas e gera o CSS. |
| `brandfy-aplicacoes` | Planeja e cria peças digitais, sociais, impressas e institucionais. |
| `brandfy-templates-canais` | Fornece modelos editáveis para Instagram, LinkedIn, email e YouTube. |
| `brandfy-manual` | Compila o manual verbal, visual, técnico e de governança. |
| `brandfy-guia-pdf` | Compila o manual editável em Markdown para PDF. |
| `brandfy-auditoria` | Confere estrutura, arquivos, acessibilidade e coerência. |

## Artefatos

O Brandfy usa `brand/` como destino padrão. O conjunto mínimo reproduz a
organização encontrada em marcas operadas pela Promovaweb e acrescenta os
arquivos necessários para outros canais:

```text
brand/
├── README.md
├── global.css
├── tokens.json
├── manifest.json
├── accessibility.md
├── legal.md
├── voice.md
├── strategy.md
├── logo/
│   ├── svg/
│   ├── png/
│   └── source/
├── favicon/
├── photography/
├── social/
├── print/
├── templates/
└── archive/
```

O manual reúne a estratégia e a linguagem em seções próprias. A parte visual
explica logo, cores, tipografia, fotografia, ilustração, iconografia e motion,
com exemplos de aplicações permitidas e inadequadas. Os diretórios de ativos
guardam as variantes vetoriais e raster, os favicons, os templates e as peças
criadas para cada canal.

Fotografia institucional precisa vir de arquivo fornecido ou autorizado pelo
titular. Quando o agente preparar um recorte sem fundo, ele preserva o original
e abre a exportação para conferir rosto, proporção e bordas. Uma imagem gerada
não substitui o retrato oficial de uma pessoa.

## Geradores incluídos

Os caminhos abaixo consideram a instalação em `.agents/skills/`. Ajuste o
prefixo quando o `skills add` usar outro diretório no projeto.

| Resultado | Comando |
| --- | --- |
| Configuração inicial | `node .agents/skills/brandfy-setup/scripts/setup.mjs --project .` |
| CSS, JSON e Tailwind | `node .agents/skills/brandfy-design-tokens/scripts/generate-tokens.mjs` |
| Webfonts e CSS tipográfico | `node .agents/skills/brandfy-tipografia-web/scripts/download-fonts.mjs` |
| SVGs e PNGs do logo | `node .agents/skills/brandfy-ativos-logo/scripts/export-logo.mjs` |
| Templates de canais | `node .agents/skills/brandfy-templates-canais/scripts/install-templates.mjs` |
| Manual em PDF | `node .agents/skills/brandfy-guia-pdf/scripts/build-brand-guide.mjs` |
| Auditoria final | `node .agents/skills/brandfy-auditoria/scripts/audit-brand.mjs` |

Cada gerador aceita os argumentos documentados em seu `SKILL.md`. Execute o
setup com `--check` para confirmar a configuração sem escrita. Os demais
geradores mantêm a fonte editável em `.brandfy/` ou `brand/` e atualizam apenas
as saídas correspondentes.

## Pesquisa e responsabilidade

O fluxo de naming registra a consulta ao INPI, a classe relacionada à atividade
e a conferência de domínio e perfis sociais. Um nome semelhante encontrado na
mesma atividade exige análise profissional, pois essas pesquisas não permitem
prever o resultado do exame oficial.

As combinações de cores para texto e componentes seguem as WCAG. O texto que
faz parte do logo possui uma exceção normativa, mas as aplicações da marca,
botões, links, ícones informativos e conteúdo editorial continuam sujeitos aos
requisitos aplicáveis de contraste.

## Desenvolvimento

Use Node.js 22 ou posterior. O comando abaixo executa os testes do setup e dos
geradores, depois confere a estrutura das skills:

```bash
npm test
```

O exportador de PNG usa ImageMagick. A validação estrutural informa quando o
comando `magick` não está disponível, sem modificar os arquivos do projeto.
