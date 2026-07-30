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

Todas as páginas entram uma única vez em `docs/reading-order.txt`. Uma página
esquecida reprova o build do ebook para impedir a publicação de uma edição
incompleta.

## Valide antes da publicação

Execute:

```bash
npm test
npm run ebook
npm run ebook:verify
```

Rode também o `quick_validate.py` do Skill Creator para cada skill alterada.
Depois, confira o diff, abra o PDF e o EPUB e leia os trechos afetados.

## Versione o ebook

`ebooks/VERSION` usa SemVer. Uma correção textual ou visual compatível aumenta
`PATCH`. Um capítulo novo ou ampliação material aumenta `MINOR`. Uma
reorganização incompatível da jornada aumenta `MAJOR`.

O build grava hashes da edição. A versão do ebook não precisa ser igual à
versão do pacote, pois os dois artefatos podem receber correções em ritmos
diferentes.
