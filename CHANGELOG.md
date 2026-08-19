# Changelog

Este arquivo registra as mudanças públicas do Brandfy. O framework, o CLI npm
e a documentação portátil compartilham a mesma versão em cada release.
Toda versão publicada também precisa ter uma seção neste arquivo, uma GitHub
Release com a tag correspondente e um pacote `@promovaweb/brandfy` no npm.

## Próxima versão

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
