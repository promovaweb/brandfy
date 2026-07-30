# Contrato dos artefatos

## Configuração

`.brandfy/config.yaml` informa o nome do projeto, o diretório da marca, o modo
de trabalho, o idioma, o público principal e o estado. Scripts que aceitam
`--config` devem resolver caminhos a partir da raiz indicada por `--project`.

O formato YAML atual é deliberadamente simples. Uma expansão precisa preservar
campos desconhecidos e incluir teste para projetos já configurados.

## Arquivos de trabalho

O setup pode preparar:

```text
.brandfy/
├── config.yaml
├── brief.md
├── interview.json
├── interview-summary.md
├── diagnostico.md
├── audit.md
├── review.md
├── interviews/
└── evidence/
```

Nem todos os arquivos aparecem na primeira execução. A skill responsável cria
o documento quando existe informação para registrar. Dados pessoais
desnecessários e ativos sem permissão não devem entrar em evidências.

## Arquivos finais

O contrato completo de `brand/` admite:

```text
brand/
├── README.md
├── strategy.md
├── voice.md
├── legal.md
├── global.css
├── tokens.json
├── tailwind-theme.js
├── accessibility.md
├── manifest.json
├── logo/
├── favicon/
├── fonts/
├── colors/
├── templates/
├── social/
├── print/
├── photography/
└── archive/
```

Uma marca não precisa preencher diretórios sem uso previsto. O manifesto lista
as exportações existentes com caminho, formato, dimensão, função e hash. Uma
entrada que aponta para arquivo ausente reprova a auditoria.

## Fontes e derivados

SVGs mestres, paleta e Markdown são fontes editáveis. PNGs, tokens gerados e
PDFs são derivados reproduzíveis. A revisão deve começar na fonte e executar o
gerador correspondente, porque uma alteração direta no derivado desaparece no
próximo build.

Substituições importantes podem preservar a versão anterior em
`brand/archive/`. O arquivo arquivado precisa manter origem e data suficientes
para investigação, sem continuar exposto como opção oficial.
