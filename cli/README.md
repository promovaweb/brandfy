# CLI do Brandfy

O pacote `@promovaweb/brandfy` instala e mantém o sistema de skills no projeto
consumidor. A conversa sobre a marca acontece exclusivamente na skill
`$brandfy`; o CLI não expõe atalhos para especialistas, geradores ou auditorias.

## Instalação

Instale o executável globalmente:

```bash
npm install --global @promovaweb/brandfy
brandfy install .
```

O comando instala o catálogo completo pelo gerenciador `skills`, prepara
`.brandfy/`, cria ou confere `BRAND.md`, mantém `brand/README.md` como índice e
atualiza o bloco gerenciado do `AGENTS.md`.

## Comandos públicos

| Comando | Resultado |
| --- | --- |
| `brandfy install .` | Instala todas as skills e prepara o projeto consumidor. |
| `brandfy update` | Atualiza as skills, reconcilia a estrutura e confere o setup. |
| `brandfy doctor` | Diagnostica Node.js, as 19 skills, lock, configuração e arquivos da marca. |

O diretório usado por `update` e `doctor` é o projeto atual. Para instalar em
outro local, informe esse caminho somente no comando `install`, como em
`brandfy install ../meu-projeto`.

Depois de `brandfy install .`, abra o agente e use apenas `$brandfy`. A skill
orquestradora chama `brandfy-setup`, `brandfy-mvp` e as demais especialistas na
ordem adequada.

## Atualizações

O framework e o CLI compartilham a mesma SemVer. Atualize o executável pelo npm
e, dentro do projeto, execute:

```bash
npm install --global @promovaweb/brandfy@latest
brandfy update
brandfy doctor
```

O `brandfy update` preserva arquivos autorais e reaplica somente a estrutura
gerenciada. O diagnóstico retorna código diferente de zero quando faltar uma
skill, configuração, arquivo da marca ou bloco de instruções.

## Desenvolvimento

Na raiz do repositório Brandfy, instale as dependências e execute os testes:

```bash
npm --prefix cli ci
npm run cli:test
npm run release:check
```

Consulte [`RELEASING.md`](../RELEASING.md) para atualizar a versão, gerar a
documentação, publicar no npm e criar a tag e a GitHub Release.
