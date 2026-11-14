# Instalação do Brandfy

## Requisitos

O projeto consumidor precisa ter uma raiz definida, permissão para criar ou
atualizar arquivos e um `AGENTS.md` que possa receber o bloco gerenciado do
Brandfy. O CLI e as skills usam Node.js 22.20 ou posterior.

ImageMagick, Pandoc e WeasyPrint são necessários somente quando o percurso
chegar a exportações raster, ao manual em PDF ou a algum asset que dependa
deles. O diagnóstico informa a dependência ausente quando ela for necessária.

## Os três comandos públicos

Instale o CLI uma vez:

```bash
npm install --global @promovaweb/brandfy
```

Depois, na raiz do projeto que receberá a marca:

```bash
brandfy install .
```

O `install` instala as 19 skills e prepara a estrutura do projeto:

- prepara `.brandfy/` e cria ou confere `BRAND.md`;
- deixa `brand/README.md` como índice e cria os diretórios esperados;
- atualiza o bloco do `AGENTS.md`.

A conversa de marca começa depois disso com a skill `$brandfy`.

Quando uma nova versão do Brandfy for publicada, use:

```bash
brandfy update
```

O `update` atualiza as skills, reaplica a estrutura gerenciada sem substituir
conteúdo autoral e executa a verificação do setup.

Para conferir a instalação e os arquivos:

```bash
brandfy doctor
```

O diagnóstico confere o Node.js, as 19 skills e o `skills-lock.json`. Depois
verifica `.brandfy/config.yaml`, `BRAND.md`, `brand/README.md` e o bloco do
`AGENTS.md`. Ele também informa se `MVP.md` foi encontrado na raiz, sem
reprovar a ausência, porque essa entrada é opcional.

## Depois da instalação

Não execute scripts das skills e não use o gerenciador `skills` diretamente. A
skill `$brandfy` lê o estado, conversa sobre as lacunas e chama
`brandfy-setup`, `brandfy-mvp` e todas as especialistas necessárias.

O capítulo [Skills do Brandfy](skills.md) explica cada especialista. O capítulo
[BRAND.md em detalhe](brand.md) explica o manual e o mapa de arquivos que a
orquestradora mantém.
