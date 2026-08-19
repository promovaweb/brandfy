/**
 * Importa um MVP.md do MVPFy e prepara a base consumida pelo Brandfy.
 *
 * O importador não altera a fonte do MVPFy. Ele registra o documento bruto em
 * um contexto JSON, deriva uma direção inicial com origem explícita e atualiza
 * somente blocos gerenciados nos documentos da marca.
 */

import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const START_MARKER = "<!-- brandfy:mvpfy:start -->";
const END_MARKER = "<!-- brandfy:mvpfy:end -->";
const SECTION_PATTERN = /<!-- mvpfy:section:([a-z0-9-]+) -->/g;
const REQUIRED_SECTIONS = [
  "account-model",
  "ai",
  "audience",
  "brand",
  "buying-roles",
  "commercial",
  "company-context",
  "confirmed-choices",
  "economics",
  "execution",
  "executive-summary",
  "hypotheses-and-gaps",
  "infrastructure",
  "main-journey",
  "manual-processes",
  "market",
  "marketing",
  "metrics",
  "modules",
  "onboarding",
  "out-of-mvp",
  "permissions",
  "personas",
  "problem",
  "proof-and-hypotheses",
  "saas-business",
  "sales",
  "scope",
  "sources",
  "subscription",
  "support-retention",
  "technology",
  "threats-and-validation",
  "value-and-positioning",
  "website",
];
const EXPECTED_ASSETS = [
  ["brand/README.md", "Índice operacional dos arquivos da marca."],
  ["brand/brand-guide.pdf", "Guia compilado da marca."],
  ["brand/strategy.md", "Estratégia verbal e posicionamento."],
  ["brand/voice.md", "Voz, tom, mensagens e vocabulário."],
  ["brand/legal.md", "Origem, licenças, naming e permissões."],
  ["brand/accessibility.md", "Combinações, legibilidade e orientações de acesso."],
  ["brand/manifest.json", "Catálogo dos assets, formatos, dimensões e hashes."],
  ["brand/global.css", "Tokens CSS e comportamento visual global."],
  ["brand/tokens.json", "Tokens estruturados para ferramentas."],
  ["brand/tailwind-theme.js", "Tema Tailwind derivado dos tokens."],
  ["brand/fonts/fonts.css", "Carregamento das webfonts e fallbacks."],
  ["brand/logo/source/", "Fontes editáveis do sistema de logo."],
  ["brand/logo/svg/", "Variantes vetoriais do logo."],
  ["brand/logo/png/", "Exportações raster do logo."],
  ["brand/favicon/", "Favicon e ícones compactos."],
  ["brand/social/", "Peças finais para canais sociais."],
  ["brand/email/", "Cabeçalhos, assinaturas e peças de email."],
  ["brand/print/", "Materiais para impressão e produção."],
  ["brand/templates/", "Fontes editáveis para agentes e designers."],
  ["brand/pdf/", "Kit local e guia compilado em PDF."],
];
const BRAND_SKELETON = `# BRAND.md

## Essência

Pendente.

## Propósito, missão, visão e valores

Pendente.

## Público e posicionamento

Pendente.

## Personalidade, voz e slogan

Pendente.

## Sistema de logo

Pendente. Documente versões principal, light, dark, monocromática, área de
proteção, tamanho mínimo e usos proibidos.

## Cores e design tokens

Pendente. Vincule \`global.css\`, \`tokens.json\` e \`tailwind-theme.js\`.

## Tipografia e webfonts

Pendente. Vincule \`fonts/fonts.css\` e registre licenças.

## Fotografia, ilustração e iconografia

Pendente.

## Templates e aplicações

Pendente. Inclua os canais definidos no MVP.md e as aplicações prioritárias.

## Acessibilidade

Pendente.

## Arquivos oficiais e governança

Pendente. Vincule \`manifest.json\`, responsáveis, versão e revisão prevista.
`;
const INDEX_SKELETON = `# Índice dos arquivos da marca

O guia completo da marca está em [BRAND.md](../BRAND.md). Este índice aponta
para os arquivos operacionais do diretório \`brand/\`.

| Arquivo ou pasta | Representação |
| --- | --- |
| [../BRAND.md](../BRAND.md) | Guia completo da marca e lacunas abertas. |
| \`strategy.md\` | Estratégia e posicionamento. |
| \`voice.md\` | Voz, tons e mensagens. |
| \`legal.md\` | Direitos, licenças e procedência. |
| \`manifest.json\` | Catálogo técnico dos assets. |
| \`global.css\`, \`tokens.json\` | Tokens visuais estruturados. |
| \`logo/\` | Fontes e exports do logo. |
| \`fonts/\` | Webfonts e CSS tipográfico. |
| \`templates/\` | Fontes editáveis de aplicações. |
| \`social/\`, \`email/\`, \`print/\` | Aplicações por canal. |
| \`pdf/\` | Kit e guia compilado em PDF. |
`;

function parseArguments(argv) {
  const options = { project: ".", input: "", check: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--project" || argument === "--input") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} exige um valor.`);
      options[argument.slice(2)] = value;
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
    }
  }
  return options;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/u);
  if (!match) return {};
  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^([a-z_]+):\s*(.*)$/u))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim().replace(/^['"]|['"]$/gu, "")]),
  );
}

function parseSections(markdown) {
  const matches = [...markdown.matchAll(SECTION_PATTERN)];
  return matches.map((match, index) => {
    const start = match.index;
    const end = matches[index + 1]?.index ?? markdown.length;
    const content = markdown.slice(start, end).trim();
    const heading = content.match(/^##\s+(.+)$/mu)?.[1]?.trim() || match[1];
    const status = content.match(/\*\*Status:\*\*\s*([^\n]+)/u)?.[1]?.trim() || "Documentado";
    return { id: match[1], heading, status, content };
  });
}

function plain(value) {
  return String(value || "")
    .replace(/<!--.*?-->/gu, "")
    .replace(/\*\*([^*]+)\*\*/gu, "$1")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/\s+/gu, " ")
    .trim();
}

function labeled(section, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const searchable = (section?.content || "").replace(/\s+/gu, " ");
  const stop = "(?=\\s+(?:Categoria|Personalidade|Slogan sugerido|Slogan|Promessa central|Posicionamento):|\\s+O nome exige|$)";
  const expressions = [
    new RegExp(`\\*\\*${escaped}:\\*\\*\\s*([\\s\\S]*?)${stop}`, "iu"),
    new RegExp(`${escaped}:\\s*([\\s\\S]*?)${stop}`, "iu"),
  ];
  for (const expression of expressions) {
    const value = searchable.match(expression)?.[1];
    if (!value) continue;
    const normalized = plain(value).replace(
      /\s+(?:\*\*)?(?:Categoria|Personalidade|Slogan sugerido|Slogan|Promessa central|Posicionamento):.*$/iu,
      "",
    );
    const clean = /nome|categoria|personalidade|slogan/iu.test(label)
      ? normalized.replace(/[.!?]$/u, "")
      : normalized;
    return clean;
  }
  return "";
}

function paragraphs(section) {
  return plain(
    section?.content
      .replace(/^<!--[^>]+-->\s*/u, "")
      .replace(/^##[^\n]+\n?/mu, "")
      .replace(/^\*\*Status:\*\*[^\n]+\n?/mu, ""),
  );
}

function tableRows(section) {
  return (section?.content || "")
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map((line) => line.trim().replace(/^\||\|$/gu, "").split("|").map((cell) => plain(cell)))
    .filter((cells) => cells.length > 1 && !cells.every((cell) => /^-+$/u.test(cell)));
}

function sectionById(sections, id) {
  return sections.find((section) => section.id === id);
}

function unique(values) {
  return [...new Set(values.filter((value) => value && value.trim()))];
}

function splitList(value) {
  return unique(String(value || "").split(/,|;| e /giu).map((item) => plain(item)));
}

function sourceLabel(input, sectionId) {
  return `${input} · mvpfy:section:${sectionId}`;
}

function derive(markdown, input) {
  const frontmatter = parseFrontmatter(markdown);
  const sections = parseSections(markdown);
  const byId = (id) => sectionById(sections, id);
  const brandSection = byId("brand");
  const positioningSection = byId("value-and-positioning");
  const audienceSection = byId("audience");
  const personaRows = tableRows(byId("personas"));
  const choiceRows = tableRows(byId("confirmed-choices")).filter((row) => row[0] !== "Data");
  const gapRows = tableRows(byId("hypotheses-and-gaps")).filter((row) => row[0] !== "Item");
  const statusFacts = sections
    .filter((section) => /confirmad/iu.test(section.status))
    .map((section) => ({
      claim: paragraphs(section),
      source: sourceLabel(input, section.id),
      status: section.status,
    }))
    .filter((item) => item.claim);

  const choices = choiceRows.map(([date, area, choice, origin]) => ({
    date,
    area,
    choice,
    origin,
    source: sourceLabel(input, "confirmed-choices"),
  }));
  const gaps = gapRows.map(([item, type, impact, nextStep]) => ({
    item,
    type,
    impact,
    nextStep,
    source: sourceLabel(input, "hypotheses-and-gaps"),
  }));
  const hypotheses = gaps.filter((item) => /hipótese|hipotese/iu.test(item.type));
  const pending = gaps.filter((item) => /pendente|posterior/iu.test(item.type));
  const name = labeled(brandSection, "Nome provisório") || labeled(brandSection, "Nome");
  const category = labeled(brandSection, "Categoria") || labeled(byId("saas-business"), "Categoria");
  const personality = splitList(labeled(brandSection, "Personalidade"));
  const slogan = labeled(brandSection, "Slogan sugerido") || labeled(brandSection, "Slogan");
  const promise = labeled(positioningSection, "Promessa central");
  const positioning = labeled(positioningSection, "Posicionamento");
  const audience = paragraphs(audienceSection);
  const persona = personaRows[1] || [];
  const channelText = [
    paragraphs(byId("website")),
    paragraphs(byId("marketing")),
    paragraphs(byId("sales")),
    paragraphs(byId("support-retention")),
  ].join(" ");
  const channels = unique([
    /comunidades/iu.test(channelText) ? "comunidades" : "",
    /Instagram/iu.test(channelText) ? "Instagram" : "",
    /YouTube/iu.test(channelText) ? "YouTube" : "",
    /WhatsApp/iu.test(channelText) ? "WhatsApp" : "",
    /landing page|página pública/iu.test(channelText) ? "landing page" : "",
    /painel|produto/iu.test(channelText) ? "produto" : "",
    /e-?mail/iu.test(channelText) ? "email" : "",
    /Open Graph/iu.test(channelText) ? "Open Graph" : "",
  ]);
  const facts = [
    ...statusFacts,
    ...choices.map((item) => ({
      claim: `${item.area}: ${item.choice}`,
      source: item.source,
      status: "Escolha confirmada no MVPFy",
    })),
  ];
  const interpretations = [
    {
      conclusion: `A marca precisa traduzir ${personality.join(", ") || "a personalidade indicada no MVPFy"} e orientar o próximo passo do cliente.`,
      basedOn: ["brand", "value-and-positioning", "main-journey"],
      rationale: `A proposta central é: ${promise || "resultado ainda não definido"}.`,
    },
    {
      conclusion: `A expressão visual deve funcionar primeiro nos pontos de contato ${channels.join(", ") || "definidos para o produto"}.`,
      basedOn: ["website", "marketing", "scope"],
      rationale: "Esses são os pontos de contato previstos para aquisição e uso do produto.",
    },
    {
      conclusion: `A marca deve comunicar o benefício central sem parecer ${category || "genérica"} ou mais complexa do que a experiência descrita.`,
      basedOn: ["problem", "value-and-positioning", "brand"],
      rationale: `O posicionamento registrado é: ${positioning || "ainda não definido"}.`,
    },
  ];
  const assetBriefs = {
    logo: {
      inputName: name || "Nome ainda aberto",
      conceptDirection: `Uma forma original para representar ${promise || "o benefício central do produto"} sem depender de ilustração literal da categoria.`,
      avoid: "Símbolos literais e genéricos da categoria sem ligação com o benefício central.",
      status: name ? "Exploração inicial" : "Nome pendente",
    },
    visual: {
      desiredImpression: personality.length ? personality : ["clara", "confiável", "coerente"],
      visualSignals: ["fluxo claro", "hierarquia funcional", "contraste acessível", "leitura rápida em tela pequena"],
      primaryUses: channels,
      status: "Direção derivada, ainda não aprovada",
    },
    voice: {
      principles: ["explicar a ação", "usar linguagem direta", "mostrar o próximo passo", "evitar promessa inflada"],
      message: promise || "Mensagem central ainda não definida no MVPFy.",
      status: "Base derivada, ainda não aprovada",
    },
  };
  const gapsForBrand = [
    ["brand.name", name ? "O nome provisório precisa de consulta de marca, domínio e perfis." : "O nome da marca não foi definido."],
    ["brand.legalName", "O MVP não informa a razão social ou o nome jurídico do responsável."],
    ["brand.geography", "A região de atuação não foi confirmada no MVP.md."],
    ["positioning.reasonsToBelieve", "O MVP descreve a proposta, mas não registra comprovação externa da promessa."],
    ["personality.antiTraits", "O MVP informa traços desejados, mas não define comportamentos a evitar."],
    ["voice.examples", "O MVP traz mensagens e canais, mas não traz exemplos de voz aprovados por situação."],
    ["voice.counterExamples", "O MVP não registra frases que a marca deve evitar em situações reais."],
    ["visual.references", "Não há referências visuais ou patrimônio existente descritos."],
    ["visual.existingColors", "Não há paleta aprovada no MVP.md."],
    ["identity.logoStatus", "O logo ainda precisa de conceito, desenho, exportação e revisão."],
    ["identity.existingAssets", "O MVP não lista logos, fontes, imagens ou templates existentes."],
    ["identity.equityToPreserve", "O MVP não registra elementos de reconhecimento que precisam ser preservados."],
    ["legal.trademarkStatus", "Não há consulta de marca, classe ou licença registrada."],
    ["legal.domains", "O MVP não registra domínios reservados ou disponíveis."],
    ["legal.licenses", "O MVP não registra licenças de fontes, imagens, ícones ou referências."],
    ["legal.consents", "O MVP não registra consentimentos para pessoas, depoimentos ou materiais."],
    ["operations.decisionMaker", "O responsável por aprovar a marca precisa ser confirmado."],
    ["operations.deadline", "O prazo de entrega da marca não foi informado no MVP.md."],
    ["operations.reviewCadence", "A periodicidade de revisão da marca não foi definida."],
  ].map(([field, question]) => ({ field, question, owner: "Responsável pelo projeto", nextStep: "Confirmar antes da publicação dos assets." }));

  return {
    schemaVersion: 1,
    source: {
      path: input,
      documentType: frontmatter.document_type || "",
      documentSchemaVersion: frontmatter.schema_version || "",
      projectId: frontmatter.project_id || "",
      projectName: frontmatter.project_name || "",
      documentStatus: frontmatter.document_status || "",
      interviewStatus: frontmatter.interview_status || "",
      language: frontmatter.language || "",
      createdAt: frontmatter.created_at || "",
      updatedAt: frontmatter.updated_at || "",
    },
    sections: sections.map(({ id, heading, status, content }) => ({ id, heading, status, content })),
    facts,
    choices,
    hypotheses,
    pending,
    interpretations,
    brand: {
      name,
      category,
      personality,
      slogan,
      promise,
      positioning,
      audience,
      persona: persona.length ? persona : [],
    },
    assetBriefs,
    gaps: gapsForBrand,
    interview: {
      schemaVersion: 1,
      source: "mvpfy",
      sourceDocument: input,
      status: "imported",
      note: "Campos preenchidos a partir do MVP.md; a importação não equivale à aprovação da marca.",
      interview: {
        date: frontmatter.updated_at || frontmatter.created_at,
        participants: ["MVPFy", frontmatter.project_name].filter(Boolean),
        facilitator: "MVPFy",
        purpose: "Preparar a base da marca a partir do plano do MVP.",
        consentObtained: false,
        consentToRecord: false,
        confirmedBy: "",
        confirmedAt: "",
      },
      progress: {
        currentStage: "imported-from-mvpfy",
        completedStages: [],
        stageConfirmations: [],
      },
      brand: {
        name,
        nameStatus: name ? "provisional" : "open",
        category,
        offer: contextOffer(sections),
        stage: paragraphs(byId("company-context")),
        geography: [],
        languages: [frontmatter.language || "pt-BR"],
        origin: paragraphs(byId("company-context")),
      },
      business: {
        model: paragraphs(byId("saas-business")),
        problem: paragraphs(byId("problem")),
        solution: promise,
        goals: [paragraphs(byId("executive-summary")), paragraphs(byId("onboarding"))].filter(Boolean),
        constraints: [paragraphs(byId("out-of-mvp")), paragraphs(byId("manual-processes"))].filter(Boolean),
        nonNegotiables: [paragraphs(byId("permissions")), paragraphs(byId("scope"))].filter(Boolean),
        proof: [paragraphs(byId("proof-and-hypotheses"))].filter(Boolean),
      },
      audiences: personaRows.slice(1).map(([audienceName, role, context, needs, objection, channel]) => ({
        name: audienceName,
        context: `${context}; canal: ${channel}`,
        needs: [needs],
        objections: [objection],
        desiredOutcome: "Resultado principal do produto alcançado e acompanhado.",
        source: sourceLabel(input, "personas"),
      })),
      positioning: {
        categoryFrame: category,
        alternatives: [paragraphs(byId("proof-and-hypotheses")), paragraphs(byId("market"))].filter(Boolean),
        promise,
        difference: positioning,
        reasonsToBelieve: [],
        associationsToBuild: personality,
        associationsToAvoid: ["caro", "complexo", "fragmentado"],
      },
      personality: {
        traits: personality,
        antiTraits: [],
        behaviors: ["orientar a próxima ação", "reduzir a troca entre ferramentas"],
        tensions: ["simples sem parecer limitado", "confiável sem parecer burocrático"],
      },
      voice: {
        principles: assetBriefs.voice.principles,
        tones: ["direto em aquisição", "orientador no produto", "claro no suporte"],
        preferredWords: ["resultado", "acompanhar", "próximo passo", "confirmar"],
        avoidedWords: ["garantia", "revolucionário", "ilimitado"],
        message: assetBriefs.voice.message,
        examples: [],
        counterExamples: [],
      },
      visual: {
        desiredImpression: assetBriefs.visual.desiredImpression,
        references: [],
        avoid: [assetBriefs.logo.avoid],
        existingColors: [],
        accessibilityNeeds: ["uso mobile-first", "contraste testado em interface e conteúdo"],
        channels,
      },
      identity: {
        sloganStatus: slogan ? "suggested" : "open",
        logoStatus: "open",
        existingAssets: [],
        equityToPreserve: [],
      },
      legal: {
        trademarkStatus: "unknown",
        niceClasses: [],
        domains: [],
        licenses: [],
        consents: [],
        restrictions: [],
      },
      operations: {
        priorityApplications: channels,
        owners: unique(choices.map((item) => item.origin)),
        decisionMaker: "",
        deadline: "",
        reviewCadence: "",
      },
      facts,
      evidence: [],
      interpretations,
      hypotheses,
      preferences: [],
      quotes: [],
      decisions: choices.map((item) => ({ topic: item.area, decision: item.choice, rationale: "Escolha registrada no MVPFy", approvedBy: item.origin, date: item.date })),
      unknowns: gapsForBrand,
    },
    sourceClaims: {
      product: [paragraphs(byId("executive-summary")), paragraphs(byId("scope")), paragraphs(byId("modules"))].filter(Boolean),
      problem: paragraphs(byId("problem")),
      audience: [paragraphs(byId("audience")), paragraphs(byId("buying-roles")), paragraphs(byId("personas"))].filter(Boolean),
      business: [paragraphs(byId("saas-business")), paragraphs(byId("commercial")), paragraphs(byId("economics"))].filter(Boolean),
      alternatives: paragraphs(byId("proof-and-hypotheses")),
      journey: paragraphs(byId("main-journey")),
      operations: [paragraphs(byId("onboarding")), paragraphs(byId("permissions")), paragraphs(byId("support-retention")), paragraphs(byId("technology")), paragraphs(byId("infrastructure"))].filter(Boolean),
      website: paragraphs(byId("website")),
      marketing: paragraphs(byId("marketing")),
      validation: [paragraphs(byId("metrics")), paragraphs(byId("threats-and-validation")), paragraphs(byId("execution")), paragraphs(byId("hypotheses-and-gaps"))].filter(Boolean),
    },
  };
}

function contextOffer(sections) {
  const executive = sectionById(sections, "executive-summary");
  return labeled(executive, "Produto") || paragraphs(executive).split(".").slice(0, 2).join(".");
}

function validateContext(context) {
  const errors = [];
  if (context.source.documentType !== "mvpfy_mvp_plan") errors.push("document_type precisa ser mvpfy_mvp_plan.");
  if (context.source.documentSchemaVersion !== "1.0.0") errors.push("schema_version precisa ser 1.0.0.");
  if (context.source.language !== "pt-BR") errors.push("language precisa ser pt-BR.");
  const ids = context.sections.map((section) => section.id);
  if (new Set(ids).size !== ids.length) errors.push("MVP.md possui marcadores de seção repetidos.");
  for (const id of REQUIRED_SECTIONS) if (!ids.includes(id)) errors.push(`MVP.md não possui a seção ${id}.`);
  if (!context.brand.promise) errors.push("A seção value-and-positioning não possui Promessa central.");
  if (!context.brand.category) errors.push("A seção brand não possui Categoria.");
  return errors;
}

function formatList(values) {
  return values?.length ? values.map((value) => `- ${value}`).join("\n") : "- Não informado no MVP.md";
}

function roleForAsset(relativePath) {
  if (relativePath.includes("logo/source")) return "Fonte editável do logo";
  if (relativePath.includes("logo/svg")) return "Logo vetorial";
  if (relativePath.includes("logo/png")) return "Logo rasterizado";
  if (relativePath.includes("favicon")) return "Ícone compacto";
  if (relativePath.endsWith("global.css")) return "Tokens CSS";
  if (relativePath.endsWith("tokens.json")) return "Tokens estruturados";
  if (relativePath.endsWith("tailwind-theme.js")) return "Tema Tailwind";
  if (relativePath.includes("fonts")) return "Webfontes e licença";
  if (relativePath.includes("templates")) return "Fonte editável de aplicação";
  if (relativePath.includes("social")) return "Aplicação social";
  if (relativePath.includes("email")) return "Aplicação de email";
  if (relativePath.includes("print")) return "Aplicação impressa";
  if (relativePath.includes("pdf")) return "Kit ou guia PDF";
  if (relativePath.endsWith("manifest.json")) return "Catálogo de assets";
  if (relativePath.endsWith("accessibility.md")) return "Acessibilidade";
  if (relativePath.endsWith("legal.md")) return "Direitos e procedência";
  if (relativePath.endsWith("strategy.md")) return "Estratégia";
  if (relativePath.endsWith("voice.md")) return "Voz";
  if (relativePath.endsWith("README.md")) return "Índice operacional";
  return "Asset da marca";
}

async function listFiles(directory, root = directory) {
  if (!(await exists(directory))) return [];
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(target, root));
    else result.push(path.relative(root, target).split(path.sep).join("/"));
  }
  return result;
}

async function assetMap(projectRoot) {
  const actual = await listFiles(path.join(projectRoot, "brand"));
  const known = EXPECTED_ASSETS.map(([relativePath, representation]) => ({
    path: relativePath,
    representation,
    status: ["brand/README.md", "brand/strategy.md", "brand/voice.md"].includes(relativePath)
      || actual.some((file) => file === relativePath.replace(/^brand\//u, "") || file.startsWith(relativePath.replace(/^brand\//u, "")))
      ? "presente"
      : "aguarda geração",
  }));
  const extra = actual
    .filter((file) => !known.some((item) => item.path === `brand/${file}`))
    .map((file) => ({ path: `brand/${file}`, representation: roleForAsset(file), status: "presente" }));
  return [...known, ...extra];
}

function renderAssetMap(map) {
  return [
    "| Caminho | Representação | Estado |",
    "| --- | --- | --- |",
    ...map.map((item) => `| \`${item.path}\` | ${item.representation} | ${item.status} |`),
  ].join("\n");
}

function renderBrand(context, map) {
  const source = context.source;
  return `Este arquivo é a entrada de leitura da marca. O contexto inicial foi derivado
de [${source.path}](${source.path}), documento gerado pelo MVPFy. A direção abaixo
é uma base de trabalho: fatos permanecem ligados à origem, e conclusões ainda
precisam passar pelas skills especialistas e pela aprovação responsável.

${START_MARKER}
## Origem do contexto

- **Projeto:** ${source.projectName || "Não informado"}
- **ID:** ${source.projectId || "Não informado"}
- **Idioma:** ${source.language || "Não informado"}
- **Estado do MVP:** ${source.documentStatus || "Não informado"}
- **Estado da entrevista:** ${source.interviewStatus || "Não informado"}
- **Atualização:** ${source.updatedAt || "Não informado"}

## Base do produto

- **Nome provisório:** ${context.brand.name || "Ainda não definido"}
- **Categoria:** ${context.brand.category || "Ainda não definida"}
- **Promessa central:** ${context.brand.promise || "Ainda não definida"}
- **Posicionamento:** ${context.brand.positioning || "Ainda não definido"}
- **Público:** ${context.brand.audience || "Ainda não definido"}
- **Personalidade registrada:** ${context.brand.personality.join(", ") || "Ainda não definida"}
- **Slogan sugerido:** ${context.brand.slogan || "Ainda não definido"}

## Conclusões para a marca

${context.interpretations.map((item) => `### ${item.conclusion}\n\n**Base:** ${item.basedOn.join(", ")}. **Leitura:** ${item.rationale}`).join("\n\n")}

## Direção para assets

### Logo

- **Direção:** ${context.assetBriefs.logo.conceptDirection}
- **Nome de entrada:** ${context.assetBriefs.logo.inputName}
- **Evitar:** ${context.assetBriefs.logo.avoid}
- **Estado:** ${context.assetBriefs.logo.status}

### Sistema visual

- **Impressão:** ${context.assetBriefs.visual.desiredImpression.join(", ")}
- **Sinais:** ${context.assetBriefs.visual.visualSignals.join(", ")}
- **Usos prioritários:** ${context.assetBriefs.visual.primaryUses.join(", ") || "Website e produto"}
- **Estado:** ${context.assetBriefs.visual.status}

### Voz

- **Princípios:** ${context.assetBriefs.voice.principles.join(", ")}
- **Mensagem:** ${context.assetBriefs.voice.message}
- **Estado:** ${context.assetBriefs.voice.status}

## Camadas que continuam abertas

### Hipóteses

${formatList(context.hypotheses.map((item) => `${item.item}: ${item.nextStep}`))}

### Pendências

${formatList(context.pending.map((item) => `${item.item}: ${item.nextStep}`))}

### Lacunas para fechar antes dos assets finais

${formatList(context.gaps.map((item) => `${item.field}: ${item.question}`))}

## Mapa de arquivos da marca

O diretório \`brand/\` concentra fontes editáveis, assets exportados e arquivos
de suporte. O estado é recompilado pelo importador e deve ser atualizado após
cada geração ou substituição.

${renderAssetMap(map)}

## Próximo fluxo

1. Revisar as conclusões deste arquivo.
2. Validar estratégia e voz.
3. Escolher direção visual e gerar tokens.
4. Criar o sistema de logo e exportar variantes.
5. Instalar templates e produzir as aplicações prioritárias.
6. Auditar arquivos, licenças, contraste e coerência do manual.
${END_MARKER}
`;
}

function renderFoundation(context) {
  return `# Brief de marca derivado do MVPFy

${START_MARKER}
## Fonte

\`${context.source.path}\`

## Fatos e escolhas aproveitados

${formatList(context.facts.map((item) => `${item.claim} (${item.source})`))}

## Interpretações para a marca

${formatList(context.interpretations.map((item) => `${item.conclusion} Base: ${item.basedOn.join(", ")}.`))}

## Lacunas

${formatList(context.gaps.map((item) => `${item.field}: ${item.question}`))}

## Brief de logo

- Conceito: ${context.assetBriefs.logo.conceptDirection}
- Evitar: ${context.assetBriefs.logo.avoid}

## Brief visual

- Impressão: ${context.assetBriefs.visual.desiredImpression.join(", ")}
- Sinais: ${context.assetBriefs.visual.visualSignals.join(", ")}
- Canais: ${context.assetBriefs.visual.primaryUses.join(", ") || "Website e produto"}

## Brief de voz

- Princípios: ${context.assetBriefs.voice.principles.join(", ")}
- Mensagem: ${context.assetBriefs.voice.message}
${END_MARKER}
`;
}

function renderStrategy(context) {
  return `## Base estratégica derivada do MVPFy

${START_MARKER}
- **Categoria:** ${context.brand.category || "Não definida"}
- **Público:** ${context.brand.audience || "Não definido"}
- **Promessa:** ${context.brand.promise || "Não definida"}
- **Posicionamento:** ${context.brand.positioning || "Não definido"}
- **Personalidade de entrada:** ${context.brand.personality.join(", ") || "Não definida"}

### Conclusões a validar

${formatList(context.interpretations.map((item) => `${item.conclusion} Base: ${item.basedOn.join(", ")}.`))}

### Limites da fonte

${formatList(context.hypotheses.map((item) => `${item.item}: ${item.nextStep}`))}
${END_MARKER}
`;
}

function renderVoice(context) {
  return `## Base verbal derivada do MVPFy

${START_MARKER}
- **Mensagem principal:** ${context.assetBriefs.voice.message}
- **Princípios de entrada:** ${context.assetBriefs.voice.principles.join(", ")}
- **Nome de entrada:** ${context.brand.name || "Ainda aberto"}
- **Slogan sugerido:** ${context.brand.slogan || "Ainda aberto"}

### Aplicação por situação

- **Produto:** orientar a próxima ação com frases curtas.
- **Aquisição:** explicar o ganho operacional sem prometer resultado garantido.
- **Suporte:** informar estado, prazo e próximo passo.
- **Cobrança:** ser claro sobre plano, limite e consequência.
${END_MARKER}
`;
}

/**
 * Identifica o README usado como manual antes da separação do guia e do índice.
 *
 * @param {string} markdown Conteúdo do README da marca.
 * @returns {boolean} Indica se o arquivo contém a estrutura legada.
 */
function isLegacyManual(markdown) {
  return /##\s+(?:Conceito visual|Paleta essencial|Sistema digital|Governança)/iu.test(markdown)
    || /^#\s+(?:Manual|Marca)/mu.test(markdown);
}

/**
 * Promove um manual legado e rebaixa seu caminho original a índice.
 *
 * @param {string} projectRoot Raiz do projeto consumidor.
 * @returns {Promise<boolean>} Indica se houve migração.
 */
async function migrateLegacyIndex(projectRoot) {
  const legacyPath = path.join(projectRoot, "brand/README.md");
  if (!(await exists(legacyPath))) return false;

  const legacy = await readFile(legacyPath, "utf8");
  if (!isLegacyManual(legacy)) return false;

  const brandPath = path.join(projectRoot, "BRAND.md");
  if (!(await exists(brandPath))) {
    await writeFile(brandPath, legacy, "utf8");
  } else {
    const archivePath = path.join(projectRoot, "brand/archive/README-legacy.md");
    if (!(await exists(archivePath))) {
      await mkdir(path.dirname(archivePath), { recursive: true });
      await writeFile(archivePath, legacy, "utf8");
    }
  }

  await writeFile(legacyPath, INDEX_SKELETON, "utf8");
  return true;
}

function mergeBlock(existing, generated) {
  const start = existing.indexOf(START_MARKER);
  const end = existing.indexOf(END_MARKER);
  if (start === -1 && end === -1) return `${existing.trimEnd()}\n\n${generated.trim()}\n`;
  if (start === -1 || end === -1 || end < start) throw new Error("Marcadores brandfy:mvpfy incompletos.");
  return `${existing.slice(0, start)}${generated.trim()}${existing.slice(end + END_MARKER.length)}`;
}

async function updateFile(target, heading, generated, fallback = `# ${heading}\n`) {
  await mkdir(path.dirname(target), { recursive: true });
  const existing = await exists(target) ? await readFile(target, "utf8") : fallback;
  await writeFile(target, mergeBlock(existing, generated), "utf8");
}

async function resolveInput(projectRoot, requested) {
  const candidates = requested ? [requested] : ["MVP.md"];
  for (const candidate of candidates) {
    const target = path.isAbsolute(candidate) ? candidate : path.resolve(projectRoot, candidate);
    if (await exists(target)) return target;
  }
  throw new Error("MVP.md não encontrado. Use --input para informar a origem.");
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const projectRoot = path.resolve(options.project);
  const input = await resolveInput(projectRoot, options.input);
  const markdown = await readFile(input, "utf8");
  const relativeInput = path.relative(projectRoot, input).split(path.sep).join("/") || path.basename(input);
  const context = derive(markdown, relativeInput);
  const errors = validateContext(context);
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  if (options.check) {
    console.log(`MVPFy compatível: ${relativeInput}, ${context.sections.length} seções.`);
    return;
  }

  await migrateLegacyIndex(projectRoot);
  const map = await assetMap(projectRoot);
  await mkdir(path.join(projectRoot, ".brandfy"), { recursive: true });
  await writeFile(path.join(projectRoot, ".brandfy/mvp-context.json"), `${JSON.stringify(context, null, 2)}\n`, "utf8");
  const interviewPath = path.join(projectRoot, ".brandfy/interview.json");
  const interviewMvpPath = path.join(projectRoot, ".brandfy/interview-mvp.json");
  const interviewTarget = await exists(interviewPath) ? interviewMvpPath : interviewPath;
  await writeFile(interviewTarget, `${JSON.stringify(context.interview, null, 2)}\n`, "utf8");
  await updateFile(path.join(projectRoot, "BRAND.md"), "BRAND.md", renderBrand(context, map), BRAND_SKELETON);
  if (!(await exists(path.join(projectRoot, "brand/README.md")))) {
    await updateFile(path.join(projectRoot, "brand/README.md"), "Índice dos arquivos da marca", "", INDEX_SKELETON);
  }
  await updateFile(path.join(projectRoot, ".brandfy/asset-brief.md"), "Brief de assets", renderFoundation(context));
  await updateFile(path.join(projectRoot, "brand/strategy.md"), "Estratégia da marca", renderStrategy(context));
  await updateFile(path.join(projectRoot, "brand/voice.md"), "Voz da marca", renderVoice(context));
  console.log(`Contexto do MVPFy importado de ${relativeInput}.`);
  console.log("Saídas: BRAND.md, .brandfy/mvp-context.json, entrevista importada, .brandfy/asset-brief.md, brand/strategy.md e brand/voice.md.");
}

await main();

export { derive, parseSections, validateContext };
