---
name: brandfy-builder
description: Coordena a construção ou revisão completa de uma marca e seus arquivos. Use quando o trabalho abranger estratégia, voz, visual e manual.
---

# Construir uma marca completa

## Protocolo operacional

- **Plano e progresso:** criar um plano com os marcos da esteira e atualizar o
  estado após cada aceite.
- **Fontes de verdade:** ler `.brandfy/config.yaml`, `.brandfy/brief.md`, os
  ativos existentes, [artifact-contract.md](references/artifact-contract.md) e
  [sources.md](references/sources.md).
- **Escopo e idempotência:** retomar o estado registrado, preservar arquivos
  aprovados e arquivar substituições em `brand/archive/`.
- **Validação:** executar `$brandfy-auditoria`, recompilar o PDF e conferir os
  arquivos exportados em tamanho real.
- **Resumo final:** registrar artefatos, escolhas aprovadas, fontes, licenças,
  validações e pendências.

## Esteira

1. Usar `$brandfy-setup` e `$brandfy-diagnostico`.
2. Definir a base com `$brandfy-estrategia`.
3. Quando o nome ainda estiver aberto, usar `$brandfy-naming`.
4. Criar o slogan com `$brandfy-slogan` e a linguagem com `$brandfy-voz`.
5. Definir direção visual com `$brandfy-identidade-visual`.
6. Preparar famílias, arquivos e CSS com `$brandfy-tipografia-web`.
7. Criar ou revisar o sistema de logo com `$brandfy-logo`.
8. Exportar versões com `$brandfy-ativos-logo`.
9. Gerar CSS, JSON e tema Tailwind com `$brandfy-design-tokens`.
10. Produzir as peças prioritárias com `$brandfy-aplicacoes` e os modelos
    digitais com `$brandfy-templates-canais`.
11. Compilar o Markdown com `$brandfy-manual`.
12. Gerar o PDF com `$brandfy-guia-pdf`.
13. Encerrar com `$brandfy-auditoria`.

Não avançar da estratégia para a criação visual quando o nome, o público, a
promessa central ou as restrições de uso continuarem contraditórios. Uma marca
existente pode pular etapas aprovadas, desde que o diagnóstico registre a
evidência usada.
