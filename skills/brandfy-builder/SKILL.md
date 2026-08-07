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
  [sources.md](references/sources.md). Ler também
  [brand-methodology.md](references/brand-methodology.md) antes de definir a
  sequência.
- **Escopo e idempotência:** retomar o estado registrado, preservar arquivos
  aprovados e arquivar substituições em `brand/archive/`.
- **Validação:** executar `$brandfy-auditoria`, recompilar o PDF e conferir os
  arquivos exportados em tamanho real.
- **Resumo final:** registrar artefatos, escolhas aprovadas, fontes, licenças,
  validações e pendências.

## Esteira

1. Usar `$brandfy-setup`.
2. Conduzir `$brandfy-entrevista` quando as respostas não estiverem confirmadas.
3. Usar `$brandfy-diagnostico` para confrontar o relato com arquivos e usos.
4. Definir a base com `$brandfy-estrategia`.
5. Quando o nome ainda estiver aberto, usar `$brandfy-naming`.
6. Criar o slogan com `$brandfy-slogan` e a linguagem com `$brandfy-voz`.
7. Definir direção visual com `$brandfy-identidade-visual`.
8. Preparar famílias, arquivos e CSS com `$brandfy-tipografia-web`.
9. Criar ou revisar o sistema de logo com `$brandfy-logo`.
10. Exportar versões com `$brandfy-ativos-logo`.
11. Gerar CSS, JSON e tema Tailwind com `$brandfy-design-tokens`.
12. Produzir as peças prioritárias com `$brandfy-aplicacoes` e os modelos
    digitais com `$brandfy-templates-canais`.
13. Compilar o Markdown com `$brandfy-manual`.
14. Gerar o PDF com `$brandfy-guia-pdf`.
15. Encerrar com `$brandfy-auditoria`.

Não avançar da estratégia para a criação visual quando o nome, o público, a
promessa central ou as restrições de uso continuarem contraditórios. Uma marca
existente pode pular etapas aprovadas, desde que o diagnóstico registre a
comprovação usada.

## Raciocínio do especialista

Em cada marco, avaliar sete dimensões: relevância para o público, distinção na
categoria, credibilidade da promessa, coerência entre linguagem e experiência,
viabilidade operacional, segurança jurídica e acessibilidade. Uma opção forte
em uma dimensão pode falhar em outra. Registrar a tensão, as alternativas
comparadas e o motivo do aceite.

Não tratar gosto pessoal como base suficiente. Preferências entram como
restrição ou hipótese; escolhas exigem ligação com estratégia, contexto de uso
e comprovação disponível.
