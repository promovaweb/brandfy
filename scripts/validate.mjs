/**
 * Valida a estrutura pública do Brandfy e o contrato mínimo de cada skill.
 *
 * O validador não altera arquivos. Ele confere nomes, frontmatter, metadados
 * de interface, referências obrigatórias e a igualdade do bloco de instruções
 * usado pelo setup com o bloco canônico mantido em AGENTS.md.
 */

import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");
const consumerStart = "<!-- brandfy:consumer:start -->";
const consumerEnd = "<!-- brandfy:consumer:end -->";

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return null;

  return Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^([a-z]+):\s*(.+)$/))
      .filter(Boolean)
      .map((entry) => [entry[1], entry[2].replace(/^"|"$/g, "")]),
  );
}

function extractConsumerBlock(source) {
  const start = source.indexOf(consumerStart);
  const end = source.indexOf(consumerEnd);
  if (start === -1 || end === -1 || end < start) return null;
  return source.slice(start, end + consumerEnd.length);
}

async function main() {
  const errors = [];
  const entries = (await readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (entries.length < 14) {
    errors.push(`Esperadas ao menos 14 skills, encontradas ${entries.length}.`);
  }

  for (const name of entries) {
    const skillPath = path.join(skillsRoot, name, "SKILL.md");
    const metadataPath = path.join(skillsRoot, name, "agents", "openai.yaml");
    let skill;
    let metadata;

    try {
      [skill, metadata] = await Promise.all([
        readFile(skillPath, "utf8"),
        readFile(metadataPath, "utf8"),
      ]);
    } catch (error) {
      errors.push(`${name}: arquivo obrigatório ausente (${error.message}).`);
      continue;
    }

    const frontmatter = extractFrontmatter(skill);
    if (!frontmatter) {
      errors.push(`${name}: frontmatter ausente ou inválido.`);
      continue;
    }

    if (frontmatter.name !== name) {
      errors.push(`${name}: o campo name precisa corresponder à pasta.`);
    }

    const descriptionLength = [...(frontmatter.description ?? "")].length;
    if (descriptionLength < 90 || descriptionLength > 200) {
      errors.push(
        `${name}: description precisa ter entre 90 e 200 caracteres (${descriptionLength}).`,
      );
    }

    if (skill.includes("TODO")) {
      errors.push(`${name}: ainda contém marcador TODO.`);
    }

    if (!skill.includes("Plano e progresso") || !skill.includes("Validação")) {
      errors.push(`${name}: precisa documentar plano, progresso e validação.`);
    }

    if (!metadata.includes(`$${name}`)) {
      errors.push(`${name}: default_prompt precisa mencionar $${name}.`);
    }
  }

  const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
  const bundled = await readFile(
    path.join(
      skillsRoot,
      "brandfy-setup",
      "references",
      "agents-consumer.md",
    ),
    "utf8",
  );
  const canonicalBlock = extractConsumerBlock(agents);
  const bundledBlock = extractConsumerBlock(bundled);

  if (!canonicalBlock || canonicalBlock !== bundledBlock) {
    errors.push(
      "O bloco do consumidor em brandfy-setup diverge do AGENTS.md canônico.",
    );
  }

  const requiredFiles = [
    "README.md",
    "LICENSE",
    "package.json",
    "skills/brandfy-setup/scripts/setup.mjs",
    "skills/brandfy-ativos-logo/scripts/export-logo.mjs",
    "skills/brandfy-design-tokens/scripts/generate-tokens.mjs",
    "skills/brandfy-auditoria/scripts/audit-brand.mjs",
  ];

  for (const relativePath of requiredFiles) {
    try {
      await access(path.join(root, relativePath));
    } catch {
      errors.push(`Arquivo obrigatório ausente: ${relativePath}.`);
    }
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(`Brandfy validado: ${entries.length} skills compatíveis.`);
}

await main();
