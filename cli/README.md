# CLI do Brandfy

O pacote `@promovaweb/brandfy` instala as skills oficiais e oferece atalhos
para preparar, conferir e compilar a marca de um projeto. O executável usa o
pacote `skills` como dependência fixa, portanto a instalação e a atualização
continuam compatíveis com `skills-lock.json`.

## Instalação

Instale o executável globalmente:

```bash
npm install --global @promovaweb/brandfy
brandfy init .
```

Também é possível executar sem instalação global:

```bash
npx @promovaweb/brandfy init .
```

O comando `init` instala todas as skills no projeto, prepara `.brandfy/`,
cria a estrutura inicial em `brand/` e inclui o bloco gerenciado no
`AGENTS.md`.

## Comandos

| Comando | Resultado |
| --- | --- |
| `brandfy init [diretório]` | Instala as skills e executa o setup. |
| `brandfy doctor [diretório]` | Confere Node.js, skills, lock, configuração, manual e instruções. |
| `brandfy skills list` | Lista o catálogo disponível na origem configurada. |
| `brandfy skills install [diretório]` | Instala todas as skills pelo `skills add`. |
| `brandfy skills update [diretório]` | Reinstala somente as skills do Brandfy a partir da origem. |
| `brandfy pdf [diretório]` | Compila `brand/README.md` em `brand/brand-guide.pdf`. |
| `brandfy audit [diretório]` | Executa a auditoria e atualiza `.brandfy/audit.md`. |
| `brandfy update [diretório]` | Atualiza as skills e executa o setup em modo de conferência. |

Use `--source <origem>` para testar um checkout local ou outra origem aceita
pelo gerenciador. O destino padrão é `promovaweb/brandfy`, e o agente padrão é
o Codex.

Os argumentos escritos depois de `--` seguem para o script da skill. Este
exemplo escolhe outro nome para o PDF:

```bash
brandfy pdf . -- --output brand/manual-da-marca.pdf
```

## Atualizações

O framework e o CLI compartilham a mesma SemVer. Atualize o executável pelo npm
e, dentro do projeto, atualize as skills:

```bash
npm install --global @promovaweb/brandfy@latest
brandfy update .
brandfy doctor .
```

O comando `brandfy update` não substitui arquivos da marca que pertencem ao
usuário. O setup executado na sequência confere a estrutura e informa qualquer
arquivo ausente.

## Desenvolvimento

Na raiz do repositório Brandfy, instale as dependências e execute os testes:

```bash
npm --prefix cli ci
npm run cli:test
npm run release:check
```

Consulte [`RELEASING.md`](../RELEASING.md) para atualizar a versão, gerar a
documentação, publicar no npm e criar a tag e a GitHub Release.
