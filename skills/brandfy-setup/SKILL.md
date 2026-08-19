---
name: brandfy-setup
description: Prepara a configuração .brandfy, a árvore de artefatos e as instruções do agente. Use ao instalar ou atualizar o Brandfy em um projeto.
---

# Configurar o Brandfy

## Protocolo operacional

- **Plano e progresso:** criar um plano visível e atualizar o estado após a
  inspeção, a configuração e a validação.
- **Fontes de verdade:** ler o `AGENTS.md` do projeto, os arquivos existentes
  em `.brandfy/` e a referência [agents-consumer.md](references/agents-consumer.md).
- **Escopo e idempotência:** preservar configurações e artefatos existentes. O
  setup só cria arquivos ausentes, migra o manual legado para `BRAND.md` e
  substitui apenas o bloco Brandfy no `AGENTS.md`.
- **Validação:** executar o setup com `--check` depois da escrita e revisar o
  `git diff`.
- **Resumo final:** informar arquivos criados, arquivos preservados,
  validações e pendências.

## Fluxo

1. Localizar a raiz do projeto e ler suas instruções.
2. Executar:

   ```bash
   node <caminho-da-skill>/scripts/setup.mjs --project .
   ```

3. Abrir `.brandfy/config.yaml` e ajustar nome, país, idioma, destino e fase da
   marca com o usuário.
4. Quando o briefing ainda estiver incompleto, usar `$brandfy-entrevista` para
   conduzir a descoberta e preencher os arquivos sem inventar respostas.
5. Preencher `.brandfy/brief.md` apenas com fatos confirmados. Manter lacunas
   explícitas, com pergunta e responsável.
6. Conferir o bloco delimitado por `brandfy:consumer` no `AGENTS.md`.
7. Executar:

   ```bash
   node <caminho-da-skill>/scripts/setup.mjs --project . --check
   ```

Depois do setup, abra `.brandfy/config.yaml`, `BRAND.md` e `brand/README.md` para
confirmar o destino, o guia e o índice. Um segundo uso deve terminar sem alterações, e
qualquer diferença indica configuração incompleta ou bloco do agente antigo.

Em um projeto antigo, o manual que ainda estiver em `brand/README.md` passa para
`BRAND.md`; uma cópia anterior fica em `brand/archive/` quando necessário.

## Raciocínio do especialista

Tratar o setup como preparação de governança, não como criação da marca.
Confirmar responsáveis por respostas e aprovações, localização das comprovações,
arquivos canônicos e forma de resolver pendências. Uma estrutura completa com
informação fraca continua sendo um projeto incompleto.
