---
name: brandfy-auditoria
description: Audita a integridade e a consistência de uma marca. Use para revisar arquivos, manual, acessibilidade, licenças e prontidão de publicação.
---

# Auditar a marca

## Protocolo operacional

- **Plano e progresso:** planejar estrutura, visual, linguagem, técnica e
  relatório.
- **Fontes de verdade:** ler `.brandfy/config.yaml`, o manual, os ativos e
  [audit-rubric.md](references/audit-rubric.md).
- **Escopo e idempotência:** auditar sem corrigir silenciosamente arquivos
  aprovados.
- **Validação:** executar o script, inspecionar amostras reais e recompilar o
  PDF.
- **Resumo final:** separar reprovações, avisos, comprovações e próximos trabalhos.

## Fluxo

1. Executar:

   ```bash
   node <caminho-da-skill>/scripts/audit-brand.mjs \
     --project . \
     --config .brandfy/config.yaml
   ```

2. Conferir presença, formato, dimensão, transparência, hash e nomenclatura dos
   ativos.
3. Comparar o manual com logos, cores, fontes, fotografias, templates e CSS.
4. Testar variantes light/dark, redução, monocromia, contraste, foco, estados e
   impressão.
5. Conferir origem, licença, consentimento, disponibilidade indicativa do nome
   e observações jurídicas.
6. Revisar voz e exemplos em canais distintos.
7. Abrir o PDF e uma amostra de cada classe de aplicação.
8. Salvar o relatório em `.brandfy/audit.md`.

A auditoria só aprova o conjunto quando os arquivos finais, a documentação e
as aplicações observadas concordarem entre si.

## Raciocínio do especialista

Auditar por cadeia de comprovação: definição, arquivo fonte, exportação,
aplicação e documentação precisam concordar. Classificar achados por impacto,
probabilidade, alcance e reversibilidade. Diferenciar impedimento de publicação,
correção necessária, melhoria recomendada e observação. Não reduzir a
auditoria à presença de arquivos.
