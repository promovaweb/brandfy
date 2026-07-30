# Rubrica de auditoria da marca

## Cadeia de evidência

Audite cada tema na sequência:

`definição → arquivo fonte → exportação → aplicação → documentação`

Uma cor aprovada pode divergir no CSS; um SVG correto pode gerar PNG com margem
errada; uma regra correta pode ser aplicada com a variante inadequada. A
presença dos arquivos não comprova concordância.

## Estratégia e linguagem

Missão, visão, valores, posicionamento, personalidade, voz e slogan precisam
concordar com exemplos reais e com o uso observado.

## Visual

Confira originalidade indicativa, proporção, variantes, redução, monocromia,
área de proteção, cor, tipografia, fotografia, iconografia, composição e
motion.

## Implementação

Confira SVG, PNG, favicon, manifesto, hashes, CSS, JSON, Tailwind, webfonts,
templates e PDF. Abra amostras reais em vez de aprovar somente pela presença
do arquivo.

## Acesso e responsabilidade

Teste contraste, foco, estados, texto alternativo, legibilidade e comunicação
sem dependência exclusiva de cor. Confirme licenças, autoria, consentimentos e
pesquisas indicativas do nome. Encaminhe questões jurídicas a profissional
qualificado.

## Classificação dos achados

| Classe | Condição | Ação |
| --- | --- | --- |
| Impeditivo | Possível conflito jurídico, perda de integridade, inacessibilidade crítica ou arquivo final incorreto | Interromper publicação |
| Correção | Divergência que afeta consistência ou uso frequente | Corrigir antes da entrega |
| Melhoria | O sistema funciona, mas possui fragilidade ou cobertura incompleta | Planejar revisão |
| Observação | Contexto que não exige mudança imediata | Registrar para governança |

Para priorizar, combine impacto, probabilidade, alcance e reversibilidade. Não
use apenas quantidade de achados.

## Amostragem

Abra pelo menos:

- todas as variantes mestres do logo;
- o menor e o maior PNG de cada função;
- uma tela light e uma dark;
- uma peça de cada canal prioritário;
- uma página com texto longo e uma com interface;
- o manual Markdown e o PDF;
- licenças e consentimentos vinculados a ativos usados.

## Resultado

O relatório precisa indicar evidência, caminho, regra afetada, severidade,
responsável, correção esperada e forma de reteste. Um item só fecha quando o
arquivo ou aplicação corrigida for aberto novamente.
