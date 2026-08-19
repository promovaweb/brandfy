/**
 * Implementa a interface pública mínima do CLI do Brandfy.
 *
 * A conversa de marca acontece na skill `$brandfy`. O CLI somente instala,
 * atualiza e diagnostica o sistema no projeto consumidor.
 */

import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createProcessRunner } from "./process-runner.mjs";
import { inspectProject, locateSkillScript } from "./project.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageManifest = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
);

export const DEFAULT_SOURCE = "promovaweb/brandfy";
export const DEFAULT_AGENT = "codex";

const HELP = `Brandfy ${packageManifest.version}

Instala e mantém o sistema de skills do Brandfy no projeto atual.

Comandos:
  brandfy install .       Instala as skills e prepara o projeto
  brandfy update           Atualiza as skills e reconcilia o projeto
  brandfy doctor           Diagnostica skills e arquivos
  brandfy --version        Mostra a versão do CLI

Opções:
  --json                   Emite o diagnóstico em JSON
  --help                   Mostra esta ajuda

Depois da instalação, converse somente com a skill $brandfy.
`;

function parseArguments(argv) {
  const positional = [];
  const options = { json: false };

  for (const argument of argv) {
    if (argument === "--json") {
      options.json = true;
    } else if (argument.startsWith("-")) {
      throw new Error(`Opção desconhecida: ${argument}`);
    } else {
      positional.push(argument);
    }
  }

  return { positional, options };
}

function projectFrom(value, cwd) {
  return path.resolve(cwd, value || ".");
}

async function ensureSuccess(result, action) {
  if (result.code !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(detail ? `${action}: ${detail}` : `${action}.`);
  }
}

async function installSkills(runner, project, label) {
  console.log(`${label} as skills do Brandfy em ${project}...`);
  const result = await runner.runSkills([
    "add",
    DEFAULT_SOURCE,
    "--agent",
    DEFAULT_AGENT,
    "--skill",
    "*",
    "-y",
    "--copy",
  ], project);
  await ensureSuccess(result, "O gerenciador skills não concluiu a instalação");
}

async function runSetup(runner, project, check = false) {
  const script = await locateSkillScript(
    project,
    "brandfy-setup",
    "scripts/setup.mjs",
  );
  if (!script) {
    throw new Error(
      "A skill brandfy-setup não está instalada. Execute brandfy install . primeiro.",
    );
  }
  const args = ["--project", project];
  if (check) args.push("--check");
  const result = await runner.runScript(script, args, project);
  await ensureSuccess(result, "O brandfy-setup não concluiu a operação");
}

function assertCommandShape(positional) {
  if (positional.length > 2) {
    throw new Error("Use somente um comando e, opcionalmente, o diretório do projeto.");
  }
}

/**
 * Executa a interface pública com dependências injetáveis para testes.
 *
 * @param {string[]} argv Argumentos sem `node` e sem o nome do binário.
 * @param {{cwd?: string, runner?: object, stdout?: Function}} dependencies
 * Dependências substituíveis pela suíte.
 * @returns {Promise<number>} Código de saída.
 */
export async function execute(argv, dependencies = {}) {
  const cwd = dependencies.cwd || process.cwd();
  const runner = dependencies.runner || createProcessRunner();
  const stdout = dependencies.stdout || console.log;

  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    stdout(HELP.trimEnd());
    return 0;
  }
  if (argv[0] === "--version" || argv[0] === "-v") {
    stdout(packageManifest.version);
    return 0;
  }

  const { positional, options } = parseArguments(argv);
  const [command, possibleProject] = positional;
  assertCommandShape(positional);

  if (![
    "install",
    "update",
    "doctor",
  ].includes(command)) {
    throw new Error(`Comando desconhecido: ${command || "(vazio)"}`);
  }

  const project = projectFrom(possibleProject, cwd);
  if (options.json && command !== "doctor") {
    throw new Error("A opção --json só pode ser usada com brandfy doctor.");
  }

  if (command === "install") {
    await installSkills(runner, project, "Instalando");
    await runSetup(runner, project);
    stdout(`Brandfy instalado e preparado em ${project}.`);
    return 0;
  }

  if (command === "update") {
    await installSkills(runner, project, "Atualizando");
    await runSetup(runner, project);
    await runSetup(runner, project, true);
    stdout(`Brandfy atualizado e conferido em ${project}.`);
    return 0;
  }

  const checks = await inspectProject(project);
  if (options.json) {
    stdout(JSON.stringify({ project, checks }, null, 2));
  } else {
    stdout(`Diagnóstico do Brandfy em ${project}`);
    for (const check of checks) {
      stdout(`${check.ok ? "✓" : "✗"} ${check.name}: ${check.detail}`);
    }
  }
  return checks.every((check) => check.ok) ? 0 : 1;
}

/**
 * Converte falhas esperadas em uma mensagem curta de terminal.
 *
 * @param {string[]} argv Argumentos do processo.
 * @returns {Promise<void>}
 */
export async function main(argv) {
  try {
    process.exitCode = await execute(argv);
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exitCode = 1;
  }
}
