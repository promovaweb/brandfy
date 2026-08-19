# Guia de desenvolvimento

Este percurso explica como o Brandfy transforma uma especialidade de branding
em uma skill instalável. Ele se destina a mantenedores do repositório,
desenvolvedores de geradores, revisores de contratos e responsáveis por uma
publicação.

Leia a [arquitetura](arquitetura.md) antes de modificar uma skill. Depois,
consulte o [contrato das skills](contrato-das-skills.md), os
[geradores](geradores.md), os [testes](testes.md) e o
[processo de contribuição](contribuicao.md).

## Autoridades técnicas

| Fonte | Autoridade |
| --- | --- |
| `skills/*/SKILL.md` | Procedimento público de cada especialidade |
| `skills/*/scripts/` | Interface executável dos geradores |
| `skills/*/references/` | Parâmetros técnicos carregados sob demanda |
| `skills/*/assets/` | Arquivos-base distribuídos com a skill |
| `tests/` | Comportamentos automatizados |
| `scripts/validate.mjs` | Estrutura pública e metadados |
| `AGENTS.md` | Regras do repositório e bloco canônico do consumidor |

Uma página desta pasta explica o código, mas não cria uma interface nova. Toda
mudança de comando precisa começar na implementação e terminar com teste e
documentação equivalentes.

## Validação rápida

Na raiz do Brandfy:

```bash
npm test
```

O comando executa os testes de setup, entrevista e geradores, depois confere a
estrutura das skills. Alterações no guia do usuário também precisam passar pelo
lint de Markdown e pelo build do ebook quando atingirem `docs/user/`.
Alterações exclusivas desta referência técnica não entram no PDF ou no EPUB.
