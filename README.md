# Brandfy

O Brandfy é uma biblioteca de skills para construir uma marca ou organizar uma
identidade existente. O trabalho produz um manual que designers, redatores,
desenvolvedores e agentes conseguem consultar para criar novos arquivos e
conferir se eles continuam fiéis à marca.

## Instalação

Instale o CLI e prepare o projeto atual:

```bash
npm install --global @promovaweb/brandfy
brandfy install .
```

O comando usa o `skills` por baixo, cria a configuração em `.brandfy/`, prepara
o diretório `brand/` e integra um bloco idempotente ao `AGENTS.md`.

Depois da instalação, converse somente com `$brandfy`. A execução sem
instalação global também está disponível:

```bash
npx @promovaweb/brandfy install .
```

Não é necessário executar o gerenciador `skills` diretamente.

## Fluxos principais

`$brandfy` coordena a construção completa. Quando existe um `MVP.md` na raiz,
ela chama `brandfy-mvp`, responde as perguntas já cobertas e registra somente
as lacunas antes do diagnóstico. Depois chama as especialistas necessárias em
ordem, sem exigir que a pessoa usuária conheça scripts ou comandos internos.

| Skill | Responsabilidade |
| --- | --- |
| `brandfy` | Orquestra todo o percurso e é a única skill chamada pela pessoa usuária. |
| `brandfy-setup` | Valida a consistência da raiz, prepara `.brandfy/`, `brand/`, `BRAND.md` e as instruções do projeto. |
| `brandfy-mvp` | Importa `MVP.md`, deriva a base da marca e prepara os briefs de assets. |
| `brandfy-entrevista` | Entrevista responsáveis e compila briefing, estratégia, voz e pendências. |
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

## Identidade do projeto

A própria marca Brandfy é documentada em [`BRAND.md`](BRAND.md). A pasta
[`brand/`](brand/) contém o logo
modular, as variantes light/dark, a paleta derivada da Promovaweb, webfontes
locais, tokens CSS/JSON/Tailwind, manual recompilável e templates de canais.
Ela também funciona como implementação de referência para as skills.

## Artefatos

O Brandfy usa `brand/` como destino padrão. O conjunto mínimo reproduz a
organização encontrada em marcas operadas pela Promovaweb e acrescenta os
arquivos necessários para outros canais:

```text
.brandfy/
├── interview.json
├── interview-summary.md
├── brief.md
└── evidence/

BRAND.md

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

`BRAND.md` reúne a estratégia e a linguagem em seções próprias. `brand/README.md`
é somente o índice dos arquivos operacionais. A parte visual
explica logo, cores, tipografia, fotografia, ilustração, iconografia e motion,
com exemplos de aplicações permitidas e inadequadas. Os diretórios de ativos
guardam as variantes vetoriais e raster, os favicons, os templates e as peças
criadas para cada canal.

Fotografia institucional precisa vir de arquivo fornecido ou autorizado pelo
titular. Quando o agente preparar um recorte sem fundo, ele preserva o original
e abre a exportação para conferir rosto, proporção e bordas. Uma imagem gerada
não substitui o retrato oficial de uma pessoa.

## Documentação

A documentação oficial separa o uso da biblioteca e a manutenção do
repositório:

- [`docs/user/`](docs/user/) acompanha instalação, descoberta, construção,
  ativos, manual, auditoria e uso por agentes. Este percurso alimenta o PDF e
  o EPUB do guia do usuário.
- [`docs/develop/`](docs/develop/) descreve arquitetura, contratos, geradores,
  testes e contribuição. Ele permanece como referência online e não entra nos
  artefatos portáteis.

O manual de uma marca cliente continua separado: sua fonte vive em `BRAND.md`
no projeto consumidor e a saída fica em
`brand/brand-guide.pdf`.

Gere e confira a edição portátil do Brandfy:

```bash
npm run ebook
npm run ebook:verify
```

## Método de trabalho

As skills atuam como especialistas de branding. Cada etapa separa fato,
comprovação, interpretação, hipótese, preferência, escolha e pendência. As
recomendações precisam apresentar parâmetros, tensões e alternativas, em vez de
usar gosto pessoal ou uma lista de adjetivos como justificativa.

O fluxo percorre descoberta, definição, desenvolvimento e entrega. Os gates
conferem relevância, distinção, credibilidade, coerência, viabilidade,
proteção e acessibilidade antes de avançar. Uma aprovação registra responsável
e motivo; uma lacuna continua aberta com pergunta e próximo passo.

## Especialistas internas

As especialistas instaladas em `.agents/skills/` são chamadas internamente por
`$brandfy`. A documentação do usuário explica a responsabilidade, a entrada,
a saída e o momento de atuação de cada uma. Não as chame diretamente, porque a
orquestradora precisa preservar a ordem, o estado e as dependências entre elas.

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

Use Node.js 22.20 ou posterior. O comando abaixo executa os testes do setup e
dos geradores, os testes do CLI e as validações das skills e da documentação:

```bash
npm --prefix cli ci
npm test
npm run release:check
```

O exportador de PNG usa ImageMagick. A validação estrutural informa quando o
comando `magick` não está disponível, sem modificar os arquivos do projeto.

O framework, o pacote `@promovaweb/brandfy` e a documentação portátil usam a
mesma SemVer. O histórico fica em [`CHANGELOG.md`](CHANGELOG.md), e o processo
de publicação, tag e GitHub Release está em
[`RELEASING.md`](RELEASING.md).
