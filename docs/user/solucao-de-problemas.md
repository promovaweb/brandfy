# Solução de problemas

## A skill não aparece

Na raiz do projeto, atualize a instalação e confira o diagnóstico:

```bash
brandfy update
brandfy doctor
```

O diagnóstico mostra as skills esperadas, os arquivos de configuração, o
estado de `BRAND.md`, o índice `brand/README.md` e a presença de `MVP.md`.

## O setup alteraria arquivos

Execute `brandfy doctor` e peça ao agente para revisar o setup. Abra o
`AGENTS.md` e procure os dois marcadores do Brandfy. Um bloco incompleto ou
duplicado precisa ser corrigido antes de outra execução. Preserve todo
conteúdo autoral fora dos marcadores.

## A entrevista não passa no check

Abra `.brandfy/interview.json` e leia as mensagens do compilador. Uma
entrevista pronta exige confirmação, data, participantes, etapas concluídas e
campos mínimos. Uma resposta ainda desconhecida deve aparecer na coleção de
pendências com pergunta e responsável.

Não altere `status` para `ready` apenas para satisfazer o validador. Complete a
conversa ou registre honestamente o que falta.

## O PNG não foi gerado

Confirme o ImageMagick e a presença dos SVGs mestres:

```bash
magick -version || convert -version
find brand/logo/svg -type f -name '*.svg' -print
```

Abra o SVG que falhou e confira `viewBox`, formas vetoriais e referências
externas. Uma fonte ausente ou uma imagem vinculada pode funcionar no editor e
falhar no ambiente do gerador.

## A webfont não carrega

Confira a URL registrada em `brand/fonts/fonts.css`, o nome do arquivo e o
MIME type servido pelo website. Abra a página com a rede desabilitada para
testar o fallback. Quando o arquivo não pode ser redistribuído, use o serviço
licenciado em vez de copiá-lo para o repositório.

## O contraste foi reprovado

Leia `brand/accessibility.md` e identifique a função semântica, o tema e a
combinação exata. Uma cor aceita no logo pode ser inadequada para texto,
controle ou indicador de foco. Corrija a paleta editável e gere novamente os
tokens, em vez de aplicar um valor isolado no componente.

## O PDF ficou sem imagens ou fontes

Execute o build na raiz do projeto e confira caminhos relativos ao Markdown.
Verifique também Pandoc e WeasyPrint:

```bash
pandoc --version
weasyprint --version
```

Depois da correção, apague somente arquivos temporários declarados pelo
compilador e gere o PDF outra vez. Nunca edite o PDF como fonte.

## A auditoria ainda apresenta avisos

Abra `.brandfy/audit.md` e relacione cada aviso ao arquivo observado. Alguns
itens exigem inspeção humana, como legibilidade no feed, procedência de uma
foto ou coerência do tom. Registre a evidência da conferência e execute a
auditoria novamente quando houver alteração técnica.

## Dados para um relato de falha

Inclua a versão do Node.js, o sistema operacional, o caminho da skill, o
comando executado, a mensagem completa e a lista dos arquivos esperados.
Remova tokens, informações pessoais, entrevistas reservadas e ativos que não
podem ser compartilhados.
