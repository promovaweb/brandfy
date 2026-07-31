/**
 * Prepara a configuração do Brandfy em um projeto consumidor.
 *
 * O script cria somente arquivos ausentes. O AGENTS.md recebe um bloco
 * delimitado que pode ser atualizado sem apagar as instruções do projeto.
 */

import {
  access,
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(scriptDir, "..");
const repositoryRoot = path.resolve(skillDir, "../..");
const pdfAssetSource = path.resolve(
  skillDir,
  "../brandfy-guia-pdf/assets/pdf-design-system",
);
const startMarker = "<!-- brandfy:consumer:start -->";
const endMarker = "<!-- brandfy:consumer:end -->";

const DEFAULT_CONFIG = `version: 1
brand_name: ""
locale: pt-BR
country: BR
brand_directory: brand
stage: discovery
interview_source: .brandfy/interview.json
interview_summary: .brandfy/interview-summary.md
manual_source: brand/README.md
manual_pdf: brand/brand-guide.pdf
`;

const DEFAULT_BRIEF = `# Briefing da marca

Preencha somente informações confirmadas. Mantenha uma pergunta aberta quando a
resposta ainda depender de pesquisa ou conversa com o responsável pela marca.

## Empresa e oferta

- Nome atual:
- Atividade:
- Produtos ou serviços:
- Região de atuação:
- Canais prioritários:

## Público

- Público principal:
- Situação que leva esse público a procurar a empresa:
- Alternativas usadas hoje:

## Marca

- Origem:
- Propósito:
- Personalidade desejada:
- Percepções que devem ser evitadas:
- Nome, slogan ou logo existentes:

## Restrições

- Prazo:
- Idiomas:
- Exigências jurídicas:
- Fontes, imagens ou ativos licenciados:
- Aplicações prioritárias:
`;

const DEFAULT_PALETTE = `{
  "name": "Marca",
  "families": {
    "primary": {
      "500": "#2563EB",
      "700": "#1D4ED8",
      "950": "#172554"
    },
    "neutral": {
      "50": "#F8FAFC",
      "200": "#E2E8F0",
      "700": "#334155",
      "950": "#020617"
    },
    "success": {
      "500": "#15803D"
    },
    "warning": {
      "500": "#A16207"
    },
    "danger": {
      "500": "#B91C1C"
    }
  },
  "light": {
    "background": "#FFFFFF",
    "surface": "#F8FAFC",
    "text": "#020617",
    "textMuted": "#334155",
    "border": "#E2E8F0",
    "accent": "#1D4ED8",
    "focus": "#2563EB"
  },
  "dark": {
    "background": "#020617",
    "surface": "#172554",
    "text": "#F8FAFC",
    "textMuted": "#E2E8F0",
    "border": "#334155",
    "accent": "#60A5FA",
    "focus": "#93C5FD"
  }
}
`;

const DEFAULT_FONTS = `{
  "families": [],
  "notes": "Adicione apenas arquivos com licença e URL direta confirmadas."
}
`;

const DEFAULT_STRATEGY = `# Estratégia da marca

## Origem e propósito

Pendente.

## Missão

Pendente.

## Visão

Pendente.

## Valores e princípios

Pendente.

## Público e posicionamento

Pendente.
`;

const DEFAULT_VOICE = `# Voz da marca

## Atributos

Pendente.

## Tons por situação

Pendente.

## Mensagens e slogan

Pendente.

## Vocabulário e grafia

Pendente.

## Exemplos e contraexemplos

Pendente.
`;

const DEFAULT_LEGAL = `# Origem, direitos e consentimentos

Registre a autoria, a origem, a licença e as permissões de cada fonte,
fotografia, ilustração, ícone, template e elemento gerado.

## Naming e marca

Pendente. Inclua data, consulta, classe, resultados observados e encaminhamento
profissional quando necessário.

## Fontes e recursos visuais

Pendente.

## Fotografias e pessoas

Pendente.
`;

const DEFAULT_MANUAL = `# Manual da marca

Este arquivo é a fonte editável do guia. Substitua os campos pendentes conforme
as etapas do Brandfy forem aprovadas e recompile o PDF depois de cada revisão.

## Essência

Pendente.

## Propósito, missão, visão e valores

Pendente.

## Público e posicionamento

Pendente.

## Personalidade, voz e slogan

Pendente.

## Sistema de logo

Pendente. Documente versões principal, light, dark, monocromática, compacta,
área de proteção, tamanho mínimo e usos proibidos.

## Cores e design tokens

Pendente. Vincule \`global.css\`, \`tokens.json\` e \`tailwind-theme.js\`.

## Tipografia e webfonts

Pendente. Vincule \`fonts/fonts.css\` e registre licenças.

## Fotografia, ilustração e iconografia

Pendente.

## Templates e aplicações

Pendente. Inclua Instagram, LinkedIn, email, YouTube, documentos e demais
canais escolhidos.

## Acessibilidade

Pendente.

## Arquivos oficiais e governança

Pendente. Vincule \`manifest.json\`, responsáveis, versão e revisão prevista.
`;

const DIRECTORIES = [
  ".brandfy/evidence",
  ".brandfy/interviews",
  ".brandfy/research",
  "brand/logo/source",
  "brand/logo/svg",
  "brand/logo/png",
  "brand/favicon",
  "brand/fonts",
  "brand/photography",
  "brand/social/instagram",
  "brand/social/linkedin",
  "brand/social/youtube",
  "brand/email",
  "brand/print",
  "brand/pdf/fonts",
  "brand/templates",
  "brand/archive",
];

const PDF_ASSETS = [
  "README.md",
  "pdf.css",
  "template.html",
  "fonts/OFL-Inter.txt",
  "fonts/OFL-Manrope.txt",
  "fonts/inter-latin.woff2",
  "fonts/manrope-latin.woff2",
];

function parseArguments(argv) {
  const options = { project: ".", check: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") {
      options.check = true;
    } else if (argument === "--project") {
      options.project = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
    }
  }

  return options;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadConsumerBlock() {
  const canonical = path.join(repositoryRoot, "AGENTS.md");
  const bundled = path.join(skillDir, "references", "agents-consumer.md");
  const source = await readFile((await exists(canonical)) ? canonical : bundled, "utf8");
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  if (start === -1 || end === -1 || end < start) {
    throw new Error("Bloco de instruções do consumidor não encontrado.");
  }

  return source.slice(start, end + endMarker.length);
}

function mergeAgents(existing, block) {
  const start = existing.indexOf(startMarker);
  const end = existing.indexOf(endMarker);

  if (start === -1 && end === -1) {
    return `${existing.trimEnd()}\n\n${block}\n`;
  }

  if (start === -1 || end === -1 || end < start) {
    throw new Error("O AGENTS.md contém marcadores Brandfy incompletos.");
  }

  return `${existing.slice(0, start)}${block}${existing.slice(end + endMarker.length)}`;
}

async function expectedChanges(projectRoot, block) {
  const missing = [];
  for (const directory of DIRECTORIES) {
    if (!(await exists(path.join(projectRoot, directory)))) {
      missing.push(`diretório ${directory}`);
    }
  }

  const files = [
    [".brandfy/config.yaml", DEFAULT_CONFIG],
    [".brandfy/brief.md", DEFAULT_BRIEF],
    [".brandfy/palette.json", DEFAULT_PALETTE],
    [".brandfy/fonts.json", DEFAULT_FONTS],
    ["brand/README.md", DEFAULT_MANUAL],
    ["brand/strategy.md", DEFAULT_STRATEGY],
    ["brand/voice.md", DEFAULT_VOICE],
    ["brand/legal.md", DEFAULT_LEGAL],
  ];

  for (const [relativePath] of files) {
    if (!(await exists(path.join(projectRoot, relativePath)))) {
      missing.push(`arquivo ${relativePath}`);
    }
  }

  for (const relativePath of PDF_ASSETS) {
    if (!(await exists(path.join(projectRoot, "brand/pdf", relativePath)))) {
      missing.push(`arquivo brand/pdf/${relativePath}`);
    }
  }

  const agentsPath = path.join(projectRoot, "AGENTS.md");
  const agents = (await exists(agentsPath))
    ? await readFile(agentsPath, "utf8")
    : "# Instruções do projeto\n";

  if (mergeAgents(agents, block) !== agents) {
    missing.push("bloco Brandfy em AGENTS.md");
  }

  return { missing, files, agentsPath, agents };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const projectRoot = path.resolve(options.project);
  const block = await loadConsumerBlock();
  const state = await expectedChanges(projectRoot, block);

  if (options.check) {
    if (state.missing.length > 0) {
      console.error(state.missing.map((item) => `- Ausente ou desatualizado: ${item}`).join("\n"));
      process.exitCode = 1;
      return;
    }

    console.log("Configuração Brandfy conferida.");
    return;
  }

  for (const directory of DIRECTORIES) {
    await mkdir(path.join(projectRoot, directory), { recursive: true });
  }

  for (const [relativePath, content] of state.files) {
    const target = path.join(projectRoot, relativePath);
    if (!(await exists(target))) {
      await writeFile(target, content, "utf8");
    }
  }

  for (const relativePath of PDF_ASSETS) {
    const target = path.join(projectRoot, "brand/pdf", relativePath);
    if (!(await exists(target))) {
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(path.join(pdfAssetSource, relativePath), target);
    }
  }

  await writeFile(state.agentsPath, mergeAgents(state.agents, block), "utf8");
  console.log(`Brandfy configurado em ${projectRoot}.`);
}

await main();
