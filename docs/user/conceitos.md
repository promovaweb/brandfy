# Como o Brandfy organiza uma marca

## O papel de cada diretório

O Brandfy separa o material de pesquisa dos arquivos aprovados. Essa separação
permite que uma entrevista registre uma hipótese sem apresentá-la no manual
como definição final.

| Caminho | Conteúdo | Pode ser publicado |
| --- | --- | --- |
| `.brandfy/` | Configuração, briefing, entrevistas, evidências, relatórios e trabalho em andamento | Não, salvo escolha explícita do responsável |
| `brand/` | Manual, logos, fontes, tokens, templates e arquivos finais | Sim, depois da auditoria |
| `.agents/skills/brandfy-*/` | Método, referências, scripts e arquivos-base instalados | Não como parte da marca |

O caminho de saída é configurável em `.brandfy/config.yaml`, embora `brand/`
seja o padrão e o formato esperado pelas skills. Uma mudança de diretório
precisa ser refletida nos comandos, links e relatórios.

## As camadas da informação

Uma entrevista de marca mistura lembranças, preferências e afirmações
comprovadas. O Brandfy registra cada uma na camada adequada:

- **Fato:** afirmação confirmada por uma fonte identificada.
- **Evidência:** arquivo, pesquisa, relato ou comportamento que fundamenta uma
  afirmação.
- **Interpretação:** leitura construída a partir de fatos informados.
- **Hipótese:** explicação que ainda precisa de teste.
- **Preferência:** gosto ou direção desejada, com seu motivo.
- **Escolha aprovada:** definição aceita por um responsável identificado.
- **Pendência:** pergunta ou trabalho que continua aberto.

Essa classificação aparece no JSON da entrevista, nos relatórios e no
raciocínio das skills. Uma preferência visual pode orientar as rotas
apresentadas, mas não deve ser descrita como preferência comprovada do público
sem pesquisa.

## As quatro fases

O fluxo completo percorre descoberta, definição, desenvolvimento e publicação.
Cada fase produz uma fonte que a próxima consegue ler.

Na descoberta, a entrevista e o diagnóstico registram o que existe, o que foi
dito e onde há conflito. Na definição, estratégia, naming, slogan e voz
explicam a marca em linguagem verificável. O desenvolvimento transforma essas
definições em sistema visual e ativos. A publicação compila o manual e confere
os arquivos com a auditoria.

## As skills como especialistas

`$brandfy` é a única skill que o usuário precisa chamar. Ela coordena o
percurso, escolhe as especialistas internas conforme o estado do projeto e
retoma o trabalho depois que cada etapa produz os arquivos esperados. Entre
essas especialistas estão `brandfy-setup`, `brandfy-mvp`, `brandfy-entrevista`,
`brandfy-estrategia`, `brandfy-identidade-visual`, `brandfy-design-tokens`,
`brandfy-manual` e `brandfy-auditoria`.

As demais skills não formam uma segunda interface pública. Elas são partes do
fluxo orquestrado e podem ser atualizadas pelo CLI sem exigir que o usuário
conheça seus scripts ou seus caminhos internos.

Cada skill precisa informar a fonte consultada, o arquivo alterado, a
conferência executada e o que permaneceu aberto. O relatório final deve
permitir que outro agente retome o trabalho sem inferir o estado anterior.
