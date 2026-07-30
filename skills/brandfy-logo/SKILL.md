---
name: brandfy-logo
description: Conceitua, cria ou revisa um sistema de logo original. Use quando a marca não possui logo ou precisa corrigir um símbolo inadequado.
---

# Criar o sistema de logo

## Protocolo operacional

- **Plano e progresso:** planejar pesquisa, conceitos, seleção, desenho e
  testes.
- **Fontes de verdade:** ler estratégia, naming, direção visual e
  [logo-system.md](references/logo-system.md).
- **Escopo e idempotência:** preservar fontes e versões aprovadas. Manter
  explorações fora da pasta final.
- **Validação:** conferir originalidade indicativa, geometria, redução,
  monocromia, light/dark, impressão e leitura.
- **Resumo final:** registrar o conceito aprovado, fontes, licenças, testes e
  arquivos encaminhados para exportação.

## Fluxo

1. Pesquisar a categoria e registrar símbolos saturados ou confundíveis.
2. Desenvolver ao menos três conceitos que partam de ideias diferentes.
3. Usar geração de imagem apenas para explorar composição. Não apresentar
   imagem raster gerada como vetor final.
4. Selecionar um conceito com o usuário ou seguir a preferência já registrada.
5. Desenhar símbolo, wordmark e lockups em SVG editável, com formas limpas,
   `viewBox` correto e texto convertido em curvas quando a licença permitir.
6. Criar versões principal, horizontal, vertical, compacta, monocromática,
   negativa, light e dark.
7. Definir área de proteção, tamanho mínimo, alinhamento e usos proibidos.
8. Salvar os SVGs mestres em `brand/logo/source/` e encaminhar a exportação
   para `$brandfy-ativos-logo`.

Quando a pesquisa mostrar um símbolo semelhante, descarte o conceito e
registre a referência consultada. O SVG final precisa permitir redução e
reprodução em uma cor sem depender do elemento encontrado.

## Raciocínio do especialista

Começar por conceitos, não por formas. Cada proposta deve ligar uma ideia da
marca a uma lógica visual e declarar possibilidade de clichê, confusão ou
limitação.
Avaliar distinção, pertinência, simplicidade reprodutiva, reconhecimento,
flexibilidade de lockup e convivência com a categoria. Preferir o conceito que
continua coerente depois de perder cor, efeito e contexto promocional.
