# Instruções do Brandfy

Este repositório mantém uma biblioteca pública de skills para criar, organizar,
documentar e revisar marcas. Responda, documente e comente código em Português
do Brasil. Preserve nomes técnicos em inglês quando eles forem a convenção da
ferramenta ou do formato.

## Organização do repositório

- `skills/` contém as skills instaláveis pelo gerenciador `skills add`.
- Cada skill mantém seu `SKILL.md`, os metadados de `agents/openai.yaml` e
  somente os scripts, referências ou templates necessários ao próprio fluxo.
- `.brandfy/` pertence ao projeto consumidor. Não salve informações de uma
  marca cliente dentro deste repositório.
- `brand/` é o destino padrão dos artefatos finais no projeto consumidor.
- Os scripts precisam ser idempotentes e devem preservar arquivos que o
  usuário já mantém.

## Qualidade e fontes

- Não apresente pesquisa de disponibilidade como parecer jurídico ou garantia
  de registro. Oriente a busca no INPI, a classificação adequada e a consulta
  profissional quando houver conflito ou investimento relevante.
- Use as WCAG vigentes para avaliar contraste de texto e componentes. A exceção
  aplicada ao logotipo não autoriza combinações ilegíveis nas demais peças.
- Preserve autoria, licença, consentimento de imagem e procedência de fontes,
  fotografias, ilustrações e elementos gerados.
- Não imite uma marca concorrente nem use um símbolo encontrado na internet
  como base de logo.

## Alterações e validação

Crie um plano visível para trabalhos com mais de uma etapa. Leia os arquivos
existentes antes de editar, mantenha compatibilidade com `skills add` e rode
`npm test` ao alterar scripts, templates, skills ou o contrato de artefatos.
Confira também cada skill com o `quick_validate.py` do Skill Creator.

<!-- brandfy:consumer:start -->
## Brandfy no projeto

O diretório `.brandfy/` guarda o briefing, a configuração e as evidências da
marca em construção. O diretório configurado em `.brandfy/config.yaml` guarda
o manual e os ativos finais.

Ao criar ou alterar a marca:

1. Leia `.brandfy/config.yaml`, `.brandfy/brief.md` e os artefatos existentes.
2. Preserve arquivos aprovados e registre a origem dos novos elementos.
3. Use as skills `brandfy-*` instaladas no projeto para a etapa correspondente.
4. Não trate busca de nome, domínio ou marca como garantia jurídica.
5. Exporte logo em SVG e PNG, com variações para fundos claros, escuros,
   monocromáticos e espaços compactos.
6. Valide contraste, legibilidade, área de proteção, tamanho mínimo, licenças,
   consentimentos e consistência entre o manual e os arquivos finais.
7. Atualize o manifesto de ativos e registre qualquer pendência no relatório
   de auditoria da marca.
<!-- brandfy:consumer:end -->
