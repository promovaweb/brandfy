# Contribuição e manutenção

## Prepare a alteração

Leia `AGENTS.md`, confira o estado do Git e identifique os arquivos que
constituem a interface pública. Uma mudança em argumento de script normalmente
atinge o próprio script, o `SKILL.md`, esta documentação e pelo menos um teste.

Mantenha comentários, mensagens e documentação em Português do Brasil. Termos
técnicos permanecem em inglês quando essa é a forma reconhecida pelo
ecossistema.

## Crie ou altere uma skill

Uma nova skill precisa representar uma especialidade que não cabe de forma
coesa em uma skill existente. Prepare `SKILL.md`, metadados e somente os
recursos necessários. Não copie todo o manual para `references/`; carregue a
fonte oficial do projeto consumidor.

Scripts devem aceitar caminhos explícitos, preservar trabalho autoral e
fornecer uma forma de conferência quando houver escrita relevante. Documente
dependências externas e mensagens de falha.

## Documente o comportamento

Atualize o guia do usuário quando a mudança altera instalação, sequência de
uso, comando ou arquivo produzido. Atualize o guia técnico quando muda a
arquitetura, o contrato ou a manutenção.

Todas as páginas do guia do usuário entram uma única vez em
`docs/user/reading-order.txt`. Uma página esquecida reprova o build do ebook
para impedir a publicação de uma edição incompleta. Páginas técnicas ficam
fora dessa ordem e não entram no PDF ou no EPUB.

## Valide antes da publicação

Execute:

```bash
npm test
npm run ebook
npm run ebook:verify
npm run release:check
npm run cli:pack
```

Rode também o `quick_validate.py` do Skill Creator para cada skill alterada.
Depois, confira o diff, abra o PDF e o EPUB e leia os trechos afetados.

## Versione a release

O framework, o CLI e o ebook usam a mesma SemVer. Aplique a versão com:

```bash
npm run version:set -- 1.2.0
```

Uma correção compatível aumenta `PATCH`, uma funcionalidade nova aumenta
`MINOR`, e uma mudança incompatível aumenta `MAJOR`. O processo de commit, tag,
registro no `CHANGELOG.md`, publicação npm e GitHub Release está em
[`RELEASING.md`](../../RELEASING.md).

A release só pode ser considerada completa quando o mesmo número aparece no
changelog, na tag `v<versão>`, na GitHub Release e no pacote
`@promovaweb/brandfy@<versão>`. A criação da GitHub Release aciona o workflow
que valida a tag e publica o pacote npm quando necessário.
