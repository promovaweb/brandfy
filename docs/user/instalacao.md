# Instalação do Brandfy

## Requisitos

O repositório de destino precisa estar acessível ao agente e usar um arquivo
`AGENTS.md` que possa receber o bloco gerenciado do Brandfy. Os geradores usam
Node.js 22 ou posterior. Algumas saídas exigem ferramentas adicionais:

| Ferramenta | Uso |
| --- | --- |
| ImageMagick | Exportação raster de SVG para PNG |
| Pandoc | Conversão do manual Markdown para HTML |
| WeasyPrint | Geração do PDF a partir do HTML |

As skills continuam úteis sem todos esses programas, mas o gerador
correspondente informará a dependência ausente. Instale somente ferramentas
compatíveis com o sistema operacional e com a política do repositório.

## Instale com a CLI de skills

Abra o terminal na raiz do projeto que receberá a marca e execute:

```bash
npx skills add promovaweb/brandfy
```

A CLI apresenta os agentes e as skills disponíveis. Para uma instalação não
interativa destinada ao Codex, use:

```bash
npx skills add promovaweb/brandfy --agent codex --skill '*' -y --copy
```

O gerenciador pode escolher `.agents/skills/` ou outro diretório compatível
com o agente. Descubra o caminho efetivo antes de executar um script
diretamente:

```bash
find . -path '*/brandfy-setup/SKILL.md' -print
```

O Hub da Promovaweb instala a biblioteca externa em `.agents/skills/`.
`.codex/skills/` permanece reservado às skills nativas do próprio Hub. Em
outro repositório, siga a convenção já adotada pelo agente em uso.

## Confira o catálogo

Liste o conteúdo remoto antes da instalação quando precisar escolher apenas
algumas especialidades:

```bash
npx skills add promovaweb/brandfy --list
```

Depois da instalação, confirme que o diretório contém `brandfy-setup`,
`brandfy-builder` e as especialidades que serão usadas. A ausência de uma skill
impede o fluxo coordenado de concluir a etapa relacionada, mas não invalida as
demais skills instaladas.

## Atualize a biblioteca

O `skills add` mantém o registro da origem no arquivo de lock usado pelo
gerenciador. Antes de atualizar, confira mudanças locais nas skills instaladas.
Uma cópia editada diretamente pode divergir da origem e deve ser preservada ou
movida para uma skill própria antes da reinstalação.

Após qualquer atualização, execute o setup em modo de conferência:

```bash
node .agents/skills/brandfy-setup/scripts/setup.mjs --project . --check
```

O comando deve terminar sem alterar arquivos. Quando ele informar estrutura
ausente, siga o capítulo [Primeira marca](primeira-marca.md) para preparar o
projeto.
