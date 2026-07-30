# Primeira marca com o Brandfy

## Prepare o projeto

Depois de instalar as skills, execute o setup na raiz do projeto consumidor:

```bash
node .agents/skills/brandfy-setup/scripts/setup.mjs --project .
```

O setup cria `.brandfy/`, prepara `brand/` e inclui um bloco delimitado no
`AGENTS.md`. O conteúdo que já existe fora dos marcadores
`brandfy:consumer:start` e `brandfy:consumer:end` deve permanecer intacto.

Execute novamente em modo de conferência:

```bash
node .agents/skills/brandfy-setup/scripts/setup.mjs --project . --check
```

O segundo comando comprova a idempotência e informa qualquer arquivo
obrigatório que esteja ausente. Abra o diff do Git antes de avançar para
confirmar que a escrita ficou restrita aos caminhos previstos.

## Preencha a configuração

O arquivo `.brandfy/config.yaml` identifica o projeto e a pasta da marca. Uma
configuração inicial usa esta forma:

```yaml
project_name: Minha Marca
brand_directory: brand
mode: greenfield
language: pt-BR
primary_audience: público ainda em pesquisa
status: draft
```

Use `mode: greenfield` para uma marca nova. Uma identidade existente pode usar
o modo de revisão adotado no projeto e começar pelo diagnóstico. Mantenha
`status: draft` enquanto definições importantes ainda estiverem abertas.

## Escolha a entrada adequada

Quando responsáveis, público, oferta ou materiais ainda não foram ouvidos,
comece com `$brandfy-entrevista`. Quando a marca possui manual e ativos
anteriores, use `$brandfy-diagnostico` para inventariá-los antes de redesenhar.

Use `$brandfy-builder` quando o trabalho abranger estratégia, voz, visual,
ativos e manual. Um pedido de escopo menor deve chamar a especialidade
correspondente. Por exemplo:

```text
Use $brandfy-design-tokens para recompilar CSS, JSON e Tailwind a partir da
paleta aprovada em .brandfy/palette.json.
```

## Confira a primeira estrutura

O setup prepara arquivos editáveis, não uma marca aprovada. Antes da
entrevista, os documentos podem conter campos vazios e instruções. O resultado
esperado é uma base organizada que preserve o trabalho existente e deixe as
lacunas visíveis.

Não publique o conteúdo inicial de `brand/` como manual final. A publicação
começa somente depois que as especialidades registrarem as fontes, os arquivos
visuais forem abertos e a auditoria não apresentar reprovações.
