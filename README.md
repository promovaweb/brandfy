<p align="center">
  <a href="https://github.com/promovaweb/brandfy">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/promovaweb/brandfy/main/brand/logo/logo-dark.png">
      <img alt="Brandfy" src="https://raw.githubusercontent.com/promovaweb/brandfy/main/brand/logo/logo-light.png" width="320">
    </picture>
  </a>
</p>

<h1 align="center">Brandfy</h1>

<p align="center">
  Biblioteca de skills que constrói, documenta e revisa o sistema de marca de um projeto com agentes de código.
</p>

<p align="center">Um projeto da <a href="https://promovaweb.com">Promovaweb</a></p>

<p align="center">
  <a href="https://github.com/promovaweb/brandfy/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/promovaweb/brandfy"></a>
  <a href="https://www.npmjs.com/package/@promovaweb/brandfy"><img alt="npm" src="https://img.shields.io/npm/v/@promovaweb/brandfy"></a>
  <a href="LICENSE"><img alt="Licença" src="https://img.shields.io/github/license/promovaweb/brandfy"></a>
</p>

<p align="center">
  <a href="https://promovaweb.com/discord"><img alt="Discord: obter ajuda e conversar com a Comunidade" src="https://img.shields.io/badge/Discord-Obter%20ajuda%20e%20conversar%20com%20a%20Comunidade-5865F2?style=for-the-badge&logo=discord&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://promovaweb.com/docs/brandfy/">Documentação</a> ·
  <a href="https://promovaweb.com/discord">Discord</a> ·
  <a href="https://promovaweb.com/planos?utm_source=github&utm_medium=readme&utm_campaign=brandfy">Planos da Promovaweb</a> ·
  <a href="CHANGELOG.md">Changelog</a>
</p>

## O que é

O Brandfy reúne o material solto de uma marca e conduz as definições que ainda
faltam: propósito, posicionamento, voz, cores, tipografia, logo e aplicações.
O resultado é um manual consultável por pessoas e por agentes antes de criar
qualquer peça nova.

O projeto atende quem está criando uma marca do zero e quem precisa organizar
uma identidade existente. A conversa acontece em linguagem natural com a skill
`$brandfy`. Ela chama as especialistas na ordem certa, sem exigir que você
conheça scripts ou comandos internos.

| Parte | Para quê |
| --- | --- |
| CLI `brandfy` | instala, atualiza e diagnostica as skills no seu projeto |
| Skills `brandfy-*` | conduzem o percurso de marca, do diagnóstico ao manual e à auditoria |
| `BRAND.md` e `brand/` | guardam o sistema de marca e os ativos finais |

## Instalação

O CLI e as skills usam Node.js 22.20 ou posterior.

```bash
npm install --global @promovaweb/brandfy
brandfy install .
```

O comando instala as 19 skills pelo gerenciador `skills`, cria `.brandfy/` e
prepara `BRAND.md` e `brand/`. Também adiciona um bloco gerenciado ao
`AGENTS.md`. Arquivos seus fora desse bloco continuam intactos.

Sem instalação global:

```bash
npx @promovaweb/brandfy install .
```

Um projeto que já usa o Brandfy atualiza assim:

```bash
npm install --global @promovaweb/brandfy@latest
brandfy update
```

## Primeiros passos

1. Execute `brandfy install .` na raiz do projeto que vai receber a marca.
2. Abra o projeto no seu agente de código.
3. Converse com `$brandfy` e responda as perguntas sobre o negócio, o público,
   a oferta e a personalidade da marca.

```text
Use $brandfy para criar a marca do meu projeto. Comece pelo diagnóstico,
mostre o que já existe e faça uma pergunta por vez.
```

Se houver um `MVP.md` na raiz, a skill `brandfy-mvp` importa o que o
[MVPFy](https://github.com/promovaweb/mvpfy) já respondeu e lista somente as
lacunas restantes. Sem esse arquivo, a entrevista começa do zero.

Ao final de cada etapa, confira o estado do projeto:

```bash
brandfy doctor
```

O diagnóstico verifica Node.js, as skills instaladas, o lock, a configuração,
`BRAND.md`, `brand/README.md` e o bloco do `AGENTS.md`. Ele sai com código
diferente de zero quando encontra algo faltando.

## Uso

| Comando | Resultado |
| --- | --- |
| `brandfy install .` | instala as skills e prepara o projeto atual |
| `brandfy install ../outro-projeto` | prepara outro diretório |
| `brandfy update` | atualiza as skills e reaplica a estrutura gerenciada |
| `brandfy doctor` | diagnostica skills, configuração e arquivos da marca |
| `brandfy doctor --json` | devolve o diagnóstico em JSON para scripts |
| `brandfy --version` | mostra a versão do CLI |
| `brandfy --help` | mostra a ajuda |

### Com os agentes

Depois da instalação, use `$brandfy` como única porta de entrada. Ela chama
`brandfy-setup`, `brandfy-mvp` e as demais especialistas conforme o estado do
projeto.

Para uma peça específica, informe a entrada, o canal e a saída:

```text
Use $brandfy para preparar um carrossel de Instagram a partir do template
aprovado. Leia BRAND.md, brand/README.md e brand/templates/README.md,
preserve a zona segura e salve o SVG editável e o PNG em 1080 × 1350.
```

O agente deve relatar quais arquivos leu, quais criou e quais conferências
executou. Uma resposta que apenas afirma fidelidade à marca não basta. O guia
[Uso da marca por agentes](docs/user/agentes.md) detalha o contrato.

### Skills incluídas

| Skill | Responsabilidade |
| --- | --- |
| `brandfy` | orquestra todo o percurso e é a única skill chamada por você |
| `brandfy-setup` | valida a raiz, prepara `.brandfy/`, `brand/`, `BRAND.md` e as instruções do projeto |
| `brandfy-mvp` | importa `MVP.md`, deriva a base da marca e prepara os briefs de assets |
| `brandfy-entrevista` | entrevista os responsáveis e compila briefing, estratégia, voz e pendências |
| `brandfy-diagnostico` | levanta materiais, procedência, lacunas e prioridades |
| `brandfy-estrategia` | define propósito, missão, visão, valores, princípios e personalidade |
| `brandfy-naming` | pesquisa nomes, disponibilidade indicativa e possíveis conflitos |
| `brandfy-slogan` | desenvolve slogans e testa entendimento, sonoridade e uso |
| `brandfy-voz` | documenta voz, tons, vocabulário, mensagens e exemplos |
| `brandfy-identidade-visual` | define direção visual, cores, tipografia, imagens e iconografia |
| `brandfy-logo` | conduz conceitos originais e a criação do sistema de logo |
| `brandfy-ativos-logo` | exporta SVG, PNG, favicons, avatares e manifestos |
| `brandfy-design-tokens` | deriva a paleta pelo círculo cromático e gera tokens CSS e JSON com combinações acessíveis |
| `brandfy-tipografia-web` | documenta a hierarquia, baixa webfontes licenciadas e gera o CSS |
| `brandfy-aplicacoes` | planeja e cria peças digitais, sociais, impressas e institucionais |
| `brandfy-templates-canais` | fornece modelos editáveis para Instagram, LinkedIn, email e YouTube |
| `brandfy-manual` | compila o manual verbal, visual, técnico e de governança |
| `brandfy-guia-pdf` | compila o manual em Markdown para PDF |
| `brandfy-auditoria` | confere estrutura, arquivos, acessibilidade e coerência da marca |

A referência de cada skill, com entrada, saída e momento de atuação, está em
[docs/user/skills.md](docs/user/skills.md).

## Documentação

O manual publicado fica em <https://promovaweb.com/docs/brandfy/>. No
repositório:

- [Guia do usuário](docs/user/README.md): instalação, descoberta, construção,
  ativos, manual, auditoria e uso por agentes. Este percurso gera o PDF e o
  EPUB do guia.
- [Guia técnico](docs/develop/README.md): arquitetura, contratos, geradores,
  testes e contribuição.
- [BRAND.md](BRAND.md) e [CHROMATIC.md](CHROMATIC.md): a marca do próprio
  Brandfy e a origem da cor, usadas como implementação de referência.
- [brand/](brand/): logo, variantes light e dark, paleta, webfontes e tokens
  do Brandfy.

## Feito com

| Projeto | Para quê |
| --- | --- |
| [Node.js](https://github.com/nodejs/node) | runtime do CLI e das skills |
| [skills](https://github.com/vercel-labs/skills) | gerenciador que instala e atualiza as skills no projeto |
| [ImageMagick](https://github.com/ImageMagick/ImageMagick) | exportação de PNG, favicons e avatares |
| [Pandoc](https://github.com/jgm/pandoc) | conversão do manual em Markdown para HTML antes do PDF |
| [WeasyPrint](https://github.com/Kozea/WeasyPrint) | geração do PDF do manual |

ImageMagick, Pandoc e WeasyPrint só são necessários quando o percurso chega a
exportações raster ou ao manual em PDF. Sem eles, o script da etapa para com
uma mensagem de erro.

## Comunidade e suporte

- **Discord:** [obter ajuda e conversar com a Comunidade](https://promovaweb.com/discord).
- **Bugs e pedidos:** abra uma [issue](https://github.com/promovaweb/brandfy/issues)
  com a versão, o sistema operacional e o passo a passo para reproduzir.
- **Novidades:** acompanhe o [CHANGELOG](CHANGELOG.md) e as
  [releases](https://github.com/promovaweb/brandfy/releases).

## Contribuir

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um pull request. Ele
traz o ambiente, a organização do código, os comandos de validação e o fluxo
de release.

## Promovaweb

O Brandfy é mantido pela [Promovaweb](https://promovaweb.com), comunidade de
co-working digital onde profissionais aprendem a construir, automatizar e
gerir negócios de tecnologia e IA com aulas ao vivo, Co-works e revisão de
projetos reais.

Quer usar o Brandfy em projetos de verdade, com acompanhamento? Conheça os
[planos da Promovaweb](https://promovaweb.com/planos?utm_source=github&utm_medium=readme&utm_campaign=brandfy).

## Licença

Distribuído sob a [GNU AGPL 3.0](LICENSE). A licença não concede o uso do
nome e do logo do Brandfy nem da marca Promovaweb (AGPL 3.0, seção 7, item e).
