# Instalação do Brandfy

## Requisitos

O repositório de destino precisa estar acessível ao agente e usar um arquivo
`AGENTS.md` que possa receber o bloco gerenciado do Brandfy. O CLI e os
geradores usam Node.js 22.20 ou posterior. Algumas saídas exigem ferramentas
adicionais:

| Ferramenta | Uso |
| --- | --- |
| ImageMagick | Exportação raster de SVG para PNG |
| Pandoc | Conversão do manual Markdown para HTML |
| WeasyPrint | Geração do PDF a partir do HTML |

As skills continuam úteis sem todos esses programas, mas o gerador
correspondente informará a dependência ausente. Instale somente ferramentas
compatíveis com o sistema operacional e com a política do repositório.

## Instale com o CLI do Brandfy

Abra o terminal na raiz do projeto que receberá a marca e execute:

```bash
npm install --global @promovaweb/brandfy
brandfy init .
```

O CLI usa o gerenciador `skills` como dependência e instala o catálogo do
Brandfy para o Codex. Também é possível executar a versão mais recente sem
instalação global:

```bash
npx @promovaweb/brandfy init .
```

Depois do setup, confira os arquivos esperados:

```bash
brandfy doctor .
```

O Hub da Promovaweb instala a biblioteca externa em `.agents/skills/`, enquanto
`.codex/skills/` permanece reservado às skills nativas do próprio Hub.

## Confira o catálogo

Liste o conteúdo remoto antes da instalação quando precisar escolher apenas
algumas especialidades:

```bash
brandfy skills list
```

Depois da instalação, confirme que o diretório contém `brandfy-setup`,
`brandfy-builder` e as especialidades que serão usadas. A ausência de uma skill
impede o fluxo coordenado de concluir a etapa relacionada, mas não invalida as
demais skills instaladas.

## Atualize o CLI e a biblioteca

O framework e o CLI usam a mesma SemVer. Atualize o pacote pelo npm e depois
reinstale as skills do Brandfy registradas no projeto:

```bash
npm install --global @promovaweb/brandfy@latest
brandfy update .
brandfy doctor .
```

O `skills add` mantém a origem em `skills-lock.json`. Uma skill modificada
diretamente pode divergir do repositório e deve ser preservada em outro
diretório antes da atualização.

O gerenciador continua disponível diretamente quando for necessário escolher
outro agente ou uma parte do catálogo:

```bash
npx skills add promovaweb/brandfy --agent codex --skill '*' -y --copy
```

Quando o diagnóstico informar estrutura ausente, siga o capítulo
[Primeira marca](primeira-marca.md) para preparar o projeto.
