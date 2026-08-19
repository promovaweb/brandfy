# Documentação do Brandfy

O Brandfy organiza a construção de uma marca em skills especializadas. A
documentação separa o guia do usuário da referência técnica porque cada
percurso atende uma necessidade diferente.

| Percurso | Para que serve | Comece por |
| --- | --- | --- |
| Guia do usuário | Instalar as skills, preparar um projeto e produzir os arquivos da marca | [Guia completo do usuário](user/README.md) |
| Guia técnico | Entender a arquitetura, alterar skills, manter geradores e publicar uma versão | [Guia de desenvolvimento](develop/README.md) |

O [guia do usuário](user/README.md) acompanha uma marca desde a instalação até
a auditoria. Ele compõe o PDF e o EPUB publicados em [`ebooks/`](../ebooks/), conforme a
ordem registrada em `user/reading-order.txt`.

O [guia técnico](develop/README.md) explica o contrato de uma skill, os
diretórios gerenciados, os geradores, os testes e a manutenção da biblioteca.
Ele é uma referência online e não faz parte do PDF ou do EPUB do usuário.

## Fontes oficiais

As páginas descrevem quatro fontes que cumprem papéis diferentes:

- `skills/` implementa as especialidades e contém scripts, referências e
  arquivos-base instaláveis.
- `.brandfy/` registra configuração, briefing e evidências do trabalho em
  andamento.
- `brand/` guarda o manual e os ativos finais de uma marca.
- `tests/` e `scripts/validate.mjs` comprovam os contratos automatizados do
  repositório.

Quando a documentação divergir de uma interface executável, corrija a página e
o teste relacionado na mesma alteração.
