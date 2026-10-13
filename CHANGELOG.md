# Changelog

Este arquivo registra as mudanças públicas do Brandfy. O framework, o CLI npm
e a documentação portátil compartilham a mesma versão em cada release.
Toda versão publicada também precisa ter uma seção neste arquivo, uma GitHub
Release com a tag correspondente e um pacote `@promovaweb/brandfy` no npm.

## [1.3.3] - 2026-10-13

### Alterado

- `brandfy-entrevista` passa a fazer uma pergunta por vez, aguardando a
  resposta antes de formular a próxima, em vez de agrupar três a cinco
  perguntas por etapa.
- Sempre que uma pergunta aceitar alternativas identificáveis, a skill agora
  apresenta opções nomeadas, com a recomendada primeiro, mantendo espaço para
  resposta livre.

### Validação

- `npm test`

## [1.3.2] - 2026-08-30

### Corrigido

- Substitui quatro ocorrências de vocabulário proibido nas instruções das
  skills de orquestração, auditoria e identidade visual.

### Validação

- `npm test`
- `npm --prefix .. run validar:skills-prohibited`
- `quick_validate.py` nas três skills alteradas

## [1.3.1] - 2026-08-22

### Corrigido

- `README.md` da raiz volta a descrever `brandfy-design-tokens`, o mapa de
  artefatos e `BRAND.md`/`CHROMATIC.md` de acordo com a ciência de cor pelo
  círculo cromático introduzida em `1.3.0`.
- `docs/user/README.md` apontava para os arquivos do ebook na versão antiga
  (`v1.1.0`); os links agora seguem a versão publicada.

## [1.3.0] - 2026-08-22

### Adicionado

- Ciência de cor baseada no círculo cromático em `brandfy-design-tokens`:
  `references/circulo-cromatico.md` documenta os esquemas de harmonia
  (monocromática, análoga, complementar, split-complementar, tríade,
  tetrádica) e `scripts/gerar-paleta-cromatica.mjs` deriva `families.primary`
  e `families.accent` de uma cor-base e de um esquema, em vez de tons
  escolhidos manualmente.
- `generate-tokens.mjs` valida a relação angular de matiz entre `primary` e
  `accent` quando `palette.json` declara `harmony`, e gera
  `brand/color-harmony.md` com o resultado.
- `CHROMATIC.md`, novo arquivo canônico na raiz de todo projeto Brandfy: guia
  de cores com a origem da cor-base (pesquisa ou preferência declarada na
  entrevista), o esquema do círculo cromático aplicado e a decisão final.
  Criado por `brandfy-setup`, preenchido por `brandfy-identidade-visual` e
  conferido por `brandfy-auditoria`.

### Alterado

- `brandfy-identidade-visual` exige cor-base pesquisada ou declarada pelo
  responsável pela marca antes de definir a paleta, nunca escolhida por
  preferência do agente.
- `brandfy` (orquestradora) registra `CHROMATIC.md` nas fontes de verdade, no
  percurso e no gate de saída.

## [1.2.0] - 2026-08-21

### Adicionado

- Skill `brandfy-mvp` para ler `MVP.md`, preparar `BRAND.md`, registrar
  contexto normalizado e listar lacunas antes da criação dos assets.
- Skill `brandfy` como única porta de entrada conversacional para orquestrar as
  especialistas do percurso completo.
- Índice `brand/README.md` e lista de arquivos dentro do guia `BRAND.md`.

### Alterado

- O manual da marca passou a ter `BRAND.md` como fonte principal, com
  `brand/README.md` reservado à navegação dos arquivos.
- O CLI público passou a expor somente `brandfy install .`, `brandfy update` e
  `brandfy doctor`.
- O contrato de release passou a exigir a mesma versão no changelog, na
  GitHub Release e no pacote npm.

## [1.1.0] - 2026-07-30

### Adicionado

- CLI `brandfy` publicado como `@promovaweb/brandfy`.
- Instalação e atualização das skills pelo gerenciador `skills`.
- Comandos para setup, diagnóstico, PDF e auditoria da marca.
- Validação de versão única entre o framework, o CLI e a documentação.
- Kit compartilhado para compilar os manuais de marca em PDF.

### Alterado

- O guia do Brandfy passou a documentar a instalação pelo pacote npm.
- O sistema de PDF agora usa o contrato visual compartilhado da Promovaweb.

## [1.0.1] - 2026-07-30

### Adicionado

- Primeira edição portátil completa da documentação do Brandfy.
- Manual visual do próprio Brandfy e exemplos de identidade.

[1.1.0]: https://github.com/promovaweb/brandfy/compare/8889486...v1.1.0
[1.0.1]: https://github.com/promovaweb/brandfy/commit/8889486
[1.2.0]: https://github.com/promovaweb/brandfy/compare/v1.1.0...v1.2.0
