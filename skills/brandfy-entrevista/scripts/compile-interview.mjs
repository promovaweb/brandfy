/**
 * Inicializa, valida e compila a entrevista estruturada do Brandfy.
 *
 * O compilador lê `.brandfy/interview.json` e atualiza somente blocos
 * delimitados nos arquivos Markdown. Conteúdo escrito fora dos marcadores é
 * preservado para permitir revisão humana e recompilação idempotente.
 */

import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptRoot, "..");
const templatePath = path.join(skillRoot, "assets", "interview-template.json");
const startMarker = "<!-- brandfy:interview:start -->";
const endMarker = "<!-- brandfy:interview:end -->";
const requiredStages = [
  "business",
  "audiences",
  "positioning",
  "personality",
  "voice",
  "visual",
  "assets-rights",
  "operations-governance",
];

/**
 * Converte os argumentos de linha de comando em opções explícitas.
 *
 * @param {string[]} argv Argumentos sem `node` e sem o caminho do script.
 * @returns {{project: string, input: string, mode: "compile"|"init"|"check"}}
 */
function parseArguments(argv) {
  const options = {
    project: ".",
    input: ".brandfy/interview.json",
    mode: "compile",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--project" || argument === "--input") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} exige um valor.`);
      }
      options[argument.slice(2)] = value;
      index += 1;
    } else if (argument === "--init") {
      options.mode = "init";
    } else if (argument === "--check") {
      options.mode = "check";
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
    }
  }

  return options;
}

/**
 * Informa se um caminho existe sem alterar o sistema de arquivos.
 *
 * @param {string} filePath Caminho absoluto.
 * @returns {Promise<boolean>}
 */
async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtém um campo aninhado por notação com pontos.
 *
 * @param {Record<string, unknown>} source Objeto consultado.
 * @param {string} field Caminho como `positioning.promise`.
 * @returns {unknown}
 */
function getField(source, field) {
  return field.split(".").reduce((value, key) => value?.[key], source);
}

/**
 * Determina se um valor contém informação aproveitável.
 *
 * @param {unknown} value Valor a conferir.
 * @returns {boolean}
 */
function hasValue(value) {
  if (Array.isArray(value)) return value.some((item) => hasValue(item));
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some((item) => hasValue(item));
  }
  return value !== null && value !== undefined;
}

/**
 * Confere o gate mínimo da entrevista e retorna lacunas legíveis.
 *
 * Um campo pode permanecer vazio quando aparece em `unknowns` com pergunta e
 * responsável, pois a ausência deixa de estar escondida e ganha próximo passo.
 *
 * @param {Record<string, any>} data Entrevista normalizada.
 * @returns {string[]}
 */
function validateInterview(data) {
  const errors = [];
  const importedFromMvp = data.status === "imported" && data.source === "mvpfy";
  const unknowns = Array.isArray(data.unknowns) ? data.unknowns : [];
  const coveredByUnknown = (field) =>
    unknowns.some(
      (entry) =>
        entry?.field === field &&
        hasValue(entry?.question) &&
        hasValue(entry?.owner),
    );

  if (data.schemaVersion !== 1) {
    errors.push("schemaVersion precisa ser 1.");
  }
  if (!importedFromMvp && data.interview?.consentObtained !== true) {
    errors.push("interview.consentObtained precisa confirmar o consentimento.");
  }
  for (const field of [
    "interview.participants",
    "interview.purpose",
    "interview.confirmedBy",
    "interview.confirmedAt",
  ]) {
    if (!importedFromMvp && !hasValue(getField(data, field))) {
      errors.push(`${field} precisa ser preenchido.`);
    }
  }

  const stageConfirmations = Array.isArray(data.progress?.stageConfirmations)
    ? data.progress.stageConfirmations
    : [];
  for (const stage of importedFromMvp ? [] : requiredStages) {
    const confirmation = stageConfirmations.find(
      (entry) => entry?.stage === stage,
    );
    if (
      !confirmation ||
      !hasValue(confirmation.confirmedBy) ||
      !hasValue(confirmation.confirmedAt)
    ) {
      errors.push(
        `progress.stageConfirmations precisa confirmar a etapa ${stage}.`,
      );
    }
  }

  const requiredFields = [
    "brand.nameStatus",
    "brand.category",
    "brand.offer",
    "brand.geography",
    "business.problem",
    "business.solution",
    "business.goals",
    "positioning.alternatives",
    "positioning.promise",
    "positioning.difference",
    "positioning.reasonsToBelieve",
    "personality.traits",
    "personality.antiTraits",
    "voice.principles",
    "visual.desiredImpression",
    "visual.channels",
    "operations.priorityApplications",
    "operations.decisionMaker",
  ];

  for (const field of requiredFields) {
    if (!hasValue(getField(data, field)) && !coveredByUnknown(field)) {
      errors.push(`${field} está vazio e não possui pendência responsável.`);
    }
  }

  if (!hasValue(data.brand?.name) && data.brand?.nameStatus !== "open") {
    errors.push("brand.name precisa ser informado ou nameStatus deve ser open.");
  }

  if (!Array.isArray(data.audiences) || data.audiences.length === 0) {
    if (!coveredByUnknown("audiences")) {
      errors.push("audiences precisa conter um público ou uma pendência responsável.");
    }
  } else {
    data.audiences.forEach((audience, index) => {
      for (const field of ["name", "context", "needs"]) {
        if (!hasValue(audience?.[field])) {
          errors.push(`audiences[${index}].${field} está vazio.`);
        }
      }
    });
  }

  if (!["ready", "approved", "imported"].includes(data.status)) {
    errors.push("status precisa ser ready, approved ou imported para compilação.");
  }
  if (importedFromMvp && !hasValue(data.sourceDocument)) {
    errors.push("sourceDocument precisa apontar para o MVP.md importado.");
  }

  return errors;
}

/**
 * Escapa caracteres que poderiam quebrar uma célula de tabela Markdown.
 *
 * @param {unknown} value Conteúdo de uma célula.
 * @returns {string}
 */
function cell(value) {
  return String(value ?? "Não confirmado")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .trim() || "Não confirmado";
}

/**
 * Renderiza um valor simples ou uma lista como texto legível.
 *
 * @param {unknown} value Valor vindo do JSON.
 * @returns {string}
 */
function text(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(cell).join("; ") : "Não confirmado";
  }
  return cell(value);
}

/**
 * Renderiza objetos de uma coleção como itens Markdown.
 *
 * @param {unknown[]} items Coleção estruturada.
 * @param {(item: any) => string} formatter Conversor de cada item.
 * @returns {string}
 */
function bullets(items, formatter) {
  if (!Array.isArray(items) || items.length === 0) {
    return "- Não confirmado";
  }
  return items.map((item) => `- ${formatter(item)}`).join("\n");
}

/**
 * Cria o bloco consolidado do briefing.
 *
 * @param {Record<string, any>} data Entrevista validada.
 * @returns {string}
 */
function renderBrief(data) {
  return `## Síntese da entrevista

### Empresa e oferta

- **Nome:** ${text(data.brand.name || `Naming ${data.brand.nameStatus}`)}
- **Nome legal:** ${text(data.brand.legalName)}
- **Categoria:** ${text(data.brand.category)}
- **Oferta:** ${text(data.brand.offer)}
- **Estágio:** ${text(data.brand.stage)}
- **Atuação:** ${text(data.brand.geography)}
- **Origem:** ${text(data.brand.origin)}

### Problema e objetivo

- **Problema:** ${text(data.business.problem)}
- **Solução:** ${text(data.business.solution)}
- **Modelo:** ${text(data.business.model)}
- **Objetivos:** ${text(data.business.goals)}
- **Restrições:** ${text(data.business.constraints)}
- **Não negociáveis:** ${text(data.business.nonNegotiables)}

### Públicos entrevistados ou descritos

${bullets(data.audiences, (item) => `**${cell(item.name)}:** ${cell(item.context)} Necessidades: ${text(item.needs)}.`)}

### Aplicações e aprovação

- **Canais:** ${text(data.visual.channels)}
- **Aplicações prioritárias:** ${text(data.operations.priorityApplications)}
- **Responsável pela aprovação:** ${text(data.operations.decisionMaker)}
- **Prazo:** ${text(data.operations.deadline)}
`;
}

/**
 * Cria o bloco estratégico a ser validado pela skill de estratégia.
 *
 * @param {Record<string, any>} data Entrevista validada.
 * @returns {string}
 */
function renderStrategy(data) {
  return `## Base estratégica obtida na entrevista

### Contexto e transformação

- **Problema observado:** ${text(data.business.problem)}
- **Solução atual:** ${text(data.business.solution)}
- **Resultado pretendido:** ${text(data.business.goals)}

### Públicos

${bullets(data.audiences, (item) => `**${cell(item.name)}:** contexto: ${cell(item.context)}; necessidades: ${text(item.needs)}; objeções: ${text(item.objections)}; resultado desejado: ${text(item.desiredOutcome)}.`)}

### Posicionamento a validar

- **Categoria de referência:** ${text(data.positioning.categoryFrame)}
- **Alternativas:** ${text(data.positioning.alternatives)}
- **Promessa:** ${text(data.positioning.promise)}
- **Diferença:** ${text(data.positioning.difference)}
- **Razões para acreditar:** ${text(data.positioning.reasonsToBelieve)}
- **Associações desejadas:** ${text(data.positioning.associationsToBuild)}
- **Associações evitadas:** ${text(data.positioning.associationsToAvoid)}

### Personalidade a validar

- **Traços:** ${text(data.personality.traits)}
- **Antitraços:** ${text(data.personality.antiTraits)}
- **Comportamentos:** ${text(data.personality.behaviors)}
- **Tensões:** ${text(data.personality.tensions)}
`;
}

/**
 * Cria o bloco verbal a ser validado pela skill de voz.
 *
 * @param {Record<string, any>} data Entrevista validada.
 * @returns {string}
 */
function renderVoice(data) {
  return `## Base verbal obtida na entrevista

- **Princípios:** ${text(data.voice.principles)}
- **Tons por situação:** ${text(data.voice.tones)}
- **Mensagem principal:** ${text(data.voice.message)}
- **Palavras preferidas:** ${text(data.voice.preferredWords)}
- **Palavras evitadas:** ${text(data.voice.avoidedWords)}

### Exemplos relatados

${bullets(data.voice.examples, (item) => cell(item))}

### Contraexemplos relatados

${bullets(data.voice.counterExamples, (item) => cell(item))}

Esta base precisa ser tensionada com exemplos reais de website, produto,
vendas, suporte, cobrança e crise antes da aprovação.
`;
}

/**
 * Cria o bloco de direitos, restrições e consultas indicativas.
 *
 * @param {Record<string, any>} data Entrevista validada.
 * @returns {string}
 */
function renderLegal(data) {
  return `## Informações jurídicas e de procedência da entrevista

- **Situação da marca:** ${text(data.legal.trademarkStatus)}
- **Classes indicativas:** ${text(data.legal.niceClasses)}
- **Domínios:** ${text(data.legal.domains)}
- **Licenças existentes:** ${text(data.legal.licenses)}
- **Consentimentos:** ${text(data.legal.consents)}
- **Restrições:** ${text(data.legal.restrictions)}

### Evidências registradas

${bullets(data.evidence, (item) => `**${cell(item.claim)}** — fonte: ${cell(item.source)}; estado: ${cell(item.status)}.`)}

Estas informações não substituem busca oficial, classificação correta nem
análise jurídica profissional.
`;
}

/**
 * Cria o resumo completo para handoff entre skills.
 *
 * @param {Record<string, any>} data Entrevista validada.
 * @returns {string}
 */
function renderSummary(data) {
  const importedFromMvp = data.status === "imported" && data.source === "mvpfy";
  const coverage = importedFromMvp
    ? "- Contexto respondido pelo documento MVPFy; somente as lacunas listadas abaixo exigem entrevista complementar."
    : bullets(data.progress.stageConfirmations, (item) => `**${cell(item.stage)}:** confirmada por ${cell(item.confirmedBy)} em ${cell(item.confirmedAt)}. ${cell(item.notes)}`);
  return `# Síntese da entrevista de marca

## Estado

- **Status:** ${text(data.status)}
- **Data:** ${text(data.interview.date)}
- **Participantes:** ${text(data.interview.participants)}
- **Objetivo:** ${text(data.interview.purpose)}
- **Fonte:** ${text(data.sourceDocument || "Entrevista direta")}
- **Síntese confirmada por:** ${importedFromMvp ? "Não aplicável: origem MVPFy" : text(data.interview.confirmedBy)}
- **Confirmação:** ${importedFromMvp ? "Aguardando validação da marca" : text(data.interview.confirmedAt)}

## Cobertura da entrevista

${coverage}

## Camadas da informação

### Fatos

${bullets(data.facts, (item) => `**${cell(item.claim)}** — fonte: ${cell(item.source)}.`)}

### Interpretações

${bullets(data.interpretations, (item) => `**${cell(item.claim)}** — derivada de: ${cell(item.basedOn)}.`)}

### Hipóteses

${bullets(data.hypotheses, (item) => `**${cell(item.claim)}** — teste previsto: ${cell(item.test)}; responsável: ${cell(item.owner)}.`)}

### Preferências

${bullets(data.preferences, (item) => `**${cell(item.topic)}:** ${cell(item.preference)} Motivo declarado: ${cell(item.rationale)}.`)}

## Direção visual a investigar

- **Impressão desejada:** ${text(data.visual.desiredImpression)}
- **Referências:** ${text(data.visual.references)}
- **Evitar:** ${text(data.visual.avoid)}
- **Cores existentes:** ${text(data.visual.existingColors)}
- **Necessidades de acessibilidade:** ${text(data.visual.accessibilityNeeds)}
- **Canais:** ${text(data.visual.channels)}

## Patrimônio existente

- **Situação do slogan:** ${text(data.identity.sloganStatus)}
- **Situação do logo:** ${text(data.identity.logoStatus)}
- **Ativos:** ${text(data.identity.existingAssets)}
- **Elementos a preservar:** ${text(data.identity.equityToPreserve)}

## Decisões

${bullets(data.decisions, (item) => `**${cell(item.topic)}:** ${cell(item.decision)} Motivo: ${cell(item.rationale)}. Aprovação: ${cell(item.approvedBy)} em ${cell(item.date)}.`)}

## Perguntas abertas

${bullets(data.unknowns, (item) => `**${cell(item.field)}:** ${cell(item.question)} Responsável: ${cell(item.owner)}. Próximo passo: ${cell(item.nextStep)}.`)}

## Citações úteis

${bullets(data.quotes, (item) => `“${cell(item.quote)}” — ${cell(item.context)}`)}

## Próximas validações

1. Executar o diagnóstico dos ativos e evidências.
2. Validar estratégia, posicionamento e públicos.
3. Validar voz com exemplos de situações críticas.
4. Explorar rotas visuais somente depois do aceite estratégico.
5. Manter as pendências abertas até que uma fonte ou responsável as resolva.
`;
}

/**
 * Insere ou substitui o bloco gerado sem tocar no restante do arquivo.
 *
 * @param {string} existing Conteúdo atual.
 * @param {string} generated Bloco Markdown sem marcadores.
 * @returns {string}
 */
function mergeGeneratedBlock(existing, generated) {
  const block = `${startMarker}\n${generated.trim()}\n${endMarker}`;
  const start = existing.indexOf(startMarker);
  const end = existing.indexOf(endMarker);

  if (start === -1 && end === -1) {
    return `${existing.trimEnd()}\n\n${block}\n`;
  }
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Marcadores brandfy:interview incompletos.");
  }

  return `${existing.slice(0, start)}${block}${existing.slice(end + endMarker.length)}`;
}

/**
 * Atualiza um arquivo Markdown preservando o conteúdo autoral.
 *
 * @param {string} target Caminho absoluto.
 * @param {string} heading Heading usado quando o arquivo não existe.
 * @param {string} generated Bloco gerado.
 * @returns {Promise<void>}
 */
async function updateMarkdown(target, heading, generated) {
  await mkdir(path.dirname(target), { recursive: true });
  const existing = (await exists(target))
    ? await readFile(target, "utf8")
    : `# ${heading}\n`;
  await writeFile(target, mergeGeneratedBlock(existing, generated), "utf8");
}

/**
 * Inicializa a fonte JSON sem substituir uma entrevista existente.
 *
 * @param {string} input Caminho absoluto da entrevista.
 * @returns {Promise<void>}
 */
async function initialize(input) {
  await mkdir(path.dirname(input), { recursive: true });
  try {
    await copyFile(templatePath, input, constants.COPYFILE_EXCL);
    console.log(`Entrevista inicializada em ${input}.`);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    console.log(`Entrevista existente preservada em ${input}.`);
  }
}

/**
 * Executa o modo solicitado e define o status de saída em caso de lacunas.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const options = parseArguments(process.argv.slice(2));
  const projectRoot = path.resolve(options.project);
  const input = path.resolve(projectRoot, options.input);

  if (options.mode === "init") {
    await initialize(input);
    return;
  }

  const data = JSON.parse(await readFile(input, "utf8"));
  const errors = validateInterview(data);
  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }

  if (options.mode === "check") {
    console.log("Entrevista pronta para compilação.");
    return;
  }

  const outputs = [
    [".brandfy/brief.md", "Briefing da marca", renderBrief(data)],
    ["brand/strategy.md", "Estratégia da marca", renderStrategy(data)],
    ["brand/voice.md", "Voz da marca", renderVoice(data)],
    ["brand/legal.md", "Origem, direitos e consentimentos", renderLegal(data)],
    [
      ".brandfy/interview-summary.md",
      "Síntese da entrevista de marca",
      renderSummary(data).replace(/^# .+\n+/, ""),
    ],
  ];

  for (const [relativePath, heading, content] of outputs) {
    await updateMarkdown(path.join(projectRoot, relativePath), heading, content);
  }

  console.log(`Entrevista compilada em ${outputs.length} arquivos.`);
}

await main();
