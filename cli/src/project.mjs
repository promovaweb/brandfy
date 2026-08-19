/**
 * Resolve a instalação do Brandfy e confere o estado do projeto consumidor.
 *
 * A busca aceita os diretórios usados pelos agentes mais comuns, mas o CLI
 * instala no escopo do projeto para manter o lock junto do repositório.
 */

import { access, readFile } from "node:fs/promises";
import path from "node:path";

export const SKILL_DIRECTORIES = [
  ".agents/skills",
  ".codex/skills",
  ".claude/skills",
];

export const REQUIRED_SKILLS = [
  "brandfy",
  "brandfy-setup",
  "brandfy-mvp",
  "brandfy-entrevista",
  "brandfy-diagnostico",
  "brandfy-estrategia",
  "brandfy-naming",
  "brandfy-slogan",
  "brandfy-voz",
  "brandfy-identidade-visual",
  "brandfy-tipografia-web",
  "brandfy-logo",
  "brandfy-ativos-logo",
  "brandfy-design-tokens",
  "brandfy-aplicacoes",
  "brandfy-templates-canais",
  "brandfy-manual",
  "brandfy-guia-pdf",
  "brandfy-auditoria",
];

export async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Localiza um script pertencente a uma skill instalada.
 *
 * @param {string} project Diretório absoluto do projeto consumidor.
 * @param {string} skill Nome da skill.
 * @param {string} script Caminho relativo dentro da skill.
 * @returns {Promise<string | null>} Caminho encontrado ou `null`.
 */
export async function locateSkillScript(project, skill, script) {
  for (const directory of SKILL_DIRECTORIES) {
    const candidate = path.join(project, directory, skill, script);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

function supportsRequiredNode(version) {
  const [major, minor] = version.split(".").map(Number);
  return major > 22 || (major === 22 && minor >= 20);
}

/**
 * Produz as verificações exibidas por `brandfy doctor`.
 *
 * @param {string} project Diretório absoluto do projeto.
 * @returns {Promise<Array<{name: string, ok: boolean, detail: string}>>}
 */
export async function inspectProject(project) {
  const agentsPath = path.join(project, "AGENTS.md");
  const agents = await exists(agentsPath)
    ? await readFile(agentsPath, "utf8")
    : "";
  const installedSkills = await Promise.all(
    REQUIRED_SKILLS.map(async (skill) => ({
      skill,
      path: await locateSkillScript(project, skill, "SKILL.md"),
    })),
  );
  const missingSkills = installedSkills
    .filter(({ path: skillPath }) => !skillPath)
    .map(({ skill }) => skill);

  return [
    {
      name: "Node.js",
      ok: supportsRequiredNode(process.versions.node),
      detail: `versão ${process.versions.node}`,
    },
    {
      name: "Biblioteca do Brandfy",
      ok: missingSkills.length === 0,
      detail: missingSkills.length === 0
        ? `${REQUIRED_SKILLS.length} skills instaladas`
        : `ausentes: ${missingSkills.join(", ")}`,
    },
    {
      name: "Lock das skills",
      ok: await exists(path.join(project, "skills-lock.json")),
      detail: "skills-lock.json",
    },
    {
      name: "Configuração",
      ok: await exists(path.join(project, ".brandfy", "config.yaml")),
      detail: ".brandfy/config.yaml",
    },
    {
      name: "Guia da marca",
      ok: await exists(path.join(project, "BRAND.md")),
      detail: "BRAND.md",
    },
    {
      name: "Índice da marca",
      ok: await exists(path.join(project, "brand", "README.md")),
      detail: "brand/README.md",
    },
    {
      name: "Instruções do agente",
      ok: agents.includes("<!-- brandfy:consumer:start -->")
        && agents.includes("<!-- brandfy:consumer:end -->"),
      detail: "bloco gerenciado no AGENTS.md",
    },
    {
      name: "MVP.md",
      ok: true,
      detail: await exists(path.join(project, "MVP.md"))
        ? "detectado; será lido pela skill brandfy-mvp"
        : "não presente; entrada opcional",
    },
  ];
}
