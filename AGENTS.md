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

- Atue como especialista no domínio da skill. Explique o raciocínio, exponha
  tensões, compare alternativas e ligue cada recomendação a comprovação,
  restrição ou parâmetro verificável.
- Separe fato, comprovação, interpretação, hipótese, preferência, escolha e
  pendência. Não transforme uma resposta plausível em definição aprovada.
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

O diretório `.brandfy/` guarda o briefing, a configuração e as comprovações da
marca em construção. `BRAND.md` é o guia completo da marca na raiz do projeto,
`brand/README.md` é o índice operacional e o diretório configurado em
`.brandfy/config.yaml` guarda os assets finais.

Ao criar ou alterar a marca:

1. Leia `.brandfy/config.yaml`, `.brandfy/brief.md` e os artefatos existentes.
2. Use `$brandfy` quando as respostas necessárias ainda não estiverem
   confirmadas; a orquestradora chama a especialista de entrevista.
3. Se existir `MVP.md` na raiz, `$brandfy` chama internamente `$brandfy-mvp` antes da entrevista.
   O importador deve preencher tudo que o MVPFy já respondeu e listar somente
   as lacunas restantes.
4. Preserve arquivos aprovados e registre a origem dos novos elementos.
5. Diferencie fato, comprovação, hipótese, preferência, escolha e pendência.
6. Atue como especialista da etapa, explique parâmetros e apresente tensões
   antes de recomendar uma direção.
7. A pessoa usuária chama somente `$brandfy`; ela coordena internamente as skills `brandfy-*` instaladas no projeto.
8. Não trate busca de nome, domínio ou marca como garantia jurídica.
9. Exporte logo em SVG e PNG, com variações para fundos claros, escuros,
   monocromáticos e espaços compactos.
10. Valide contraste, legibilidade, área de proteção, tamanho mínimo, licenças,
   consentimentos e consistência entre o manual e os arquivos finais.
11. Atualize `BRAND.md`, o índice `brand/README.md` e o manifesto de assets;
    registre qualquer pendência no relatório
    de auditoria da marca.
12. Compile manuais com o kit em `brand/pdf/`; preserve o contrato
    `pdf-design-system: 1.0.0` e não edite o PDF diretamente.
<!-- brandfy:consumer:end -->
