# Contrato das skills

## Estrutura mínima

Cada diretório em `skills/` contém `SKILL.md` e
`agents/openai.yaml`. Scripts, referências e arquivos-base entram somente
quando a especialidade precisa deles:

```text
skills/brandfy-exemplo/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── assets/
├── references/
└── scripts/
```

`SKILL.md` começa com frontmatter que declara `name` e `description`. O nome
precisa corresponder ao diretório. A descrição deve informar a tarefa e a
sinalização de uso com extensão suficiente para o agente selecionar a skill.

## Protocolo operacional

Toda skill documenta cinco partes: plano e progresso, fontes de verdade, escopo
e idempotência, validação e resumo final. Depois, ela explica o fluxo próprio e
o raciocínio do especialista.

A instrução precisa levar o agente a comparar alternativas e a fundamentar uma
recomendação com evidência ou parâmetro verificável. Adjetivos vagos não
substituem a explicação. Uma direção descrita como “moderna” deve mostrar a
composição, o uso, a limitação e a relação com a estratégia.

## Metadados para o agente

`agents/openai.yaml` mantém a interface mostrada pelo agente e um
`default_prompt` que cita a skill no formato `$brandfy-nome`. O validador
confere essa referência para impedir um diretório instalável cuja interface
não chama a própria especialidade.

## Referências e arquivos-base

Uma referência contém parâmetros que a skill precisa ler para executar a
tarefa. Ela não deve repetir regras gerais que já estão no `SKILL.md`. Um
arquivo em `assets/` é distribuído como fonte, exemplo ou template e nunca deve
ser confundido com resultado aprovado de uma marca.

Scripts ficam próximos da skill porque são parte da mesma interface pública.
Os argumentos precisam aceitar caminhos explícitos, produzir mensagens em
Português do Brasil e sair com código diferente de zero quando a saída não
puder ser comprovada.

## Compatibilidade com o Skill Creator

Além de `npm test`, cada skill alterada deve passar pelo `quick_validate.py`
fornecido pelo Skill Creator. O teste local do Brandfy confere regras próprias,
enquanto o validador externo confere o formato aceito pelo ecossistema.
