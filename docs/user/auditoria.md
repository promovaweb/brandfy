# Auditoria da marca

## Execute a conferência automatizada

Depois de compilar o manual e gerar os ativos, rode:

```bash
node .agents/skills/brandfy-auditoria/scripts/audit-brand.mjs \
  --project . \
  --config .brandfy/config.yaml
```

O relatório padrão fica em `.brandfy/audit.md`. Ele separa reprovações, avisos,
evidências encontradas e itens que dependem de inspeção humana. A skill não
corrige silenciosamente um arquivo aprovado.

## Confronte definição, fonte e aplicação

A auditoria compara o que o manual afirma com o arquivo fonte, a exportação e a
aplicação observada. Uma paleta pode estar documentada corretamente e ainda
falhar quando o template usa um valor antigo. Um PNG pode ter a dimensão
prevista e ainda apresentar margem desigual ou transparência incorreta.

Abra pelo menos:

- as variantes light e dark do logo;
- o ícone no tamanho mínimo;
- uma peça de cada canal prioritário;
- uma página de interface nos dois temas;
- o manual em PDF;
- um texto produzido com o guia de voz.

Também confira a licença das fontes, a procedência de fotografias, o
consentimento de imagem e o registro das pesquisas de naming. A busca de nome e
domínio continua sendo indicativa.

## Interprete o relatório

Uma reprovação impede a publicação do conjunto afetado. Um aviso registra uma
correção necessária ou uma melhoria cuja consequência precisa ser avaliada. A
inspeção humana deve acrescentar evidência ao relatório em vez de apenas marcar
um item como concluído.

Depois de corrigir um arquivo, atualize o manifesto quando necessário,
recompile o PDF e execute a auditoria outra vez. O resultado está pronto quando
o manual, os ativos e as aplicações concordam e as pendências aceitas possuem
responsável e motivo.
