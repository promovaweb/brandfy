/**
 * Implementa a interface de linha de comando do Brandfy.
 *
 * O CLI delega instalação e atualização ao pacote `skills`. Os comandos de
 * geração executam os scripts das skills instaladas no projeto consumidor.
 */

import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createProcessRunner } from "./process-runner.mjs";
import {
  inspectProject,
  locateSkillScript,
} from "./project.mjs";

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

Instala as skills do Brandfy e executa os geradores no projeto atual.

Uso:
  brandfy init [diretório]              Instala as skills e prepara a marca
  brandfy doctor [diretório] [--json]   Confere a instalação e os arquivos
  brandfy skills list                   Lista as skills disponíveis
  brandfy skills install [diretório]    Instala todas as skills
  brandfy skills update [diretório]     Atualiza somente as skills do Brandfy
  brandfy pdf [diretório] [-- ...]      Compila brand/README.md em PDF
  brandfy audit [diretório] [-- ...]    Audita a estrutura da marca
  brandfy update [diretório]            Atualiza as skills e confere o setup
  brandfy --version                     Mostra a versão do CLI

Opções:
  --source <origem>   Repositório ou caminho aceito pelo skills add
  --agent <agente>    Agente de destino (padrão: codex)
  --json              Emite o diagnóstico como JSON
  --help              Mostra esta ajuda

Os argumentos escritos depois de -- seguem para o gerador de PDF ou auditoria.
`;

function parseArguments(argv) {
  const positional = [];
  const passthrough = [];
  const options = {
    source: DEFAULT_SOURCE,
    agent: DEFAULT_AGENT,
    json: false,
  };
  let forwarding = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (forwarding) {
      passthrough.push(argument);
    } else if (argument === "--") {
      forwarding = true;
    } else if (argument === "--source" || argument === "--agent") {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} exige um valor.`);
      options[argument.slice(2)] = value;
      index += 1;
    } else if (argument === "--json") {
      options.json = true;
    } else if (argument.startsWith("-")) {
      throw new Error(`Opção desconhecida: ${argument}`);
    } else {
      positional.push(argument);
    }
  }

  return { positional, passthrough, options };
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

async function installSkills(runner, project, options, label) {
  console.log(`${label} as skills do Brandfy em ${project}...`);
  const result = await runner.runSkills([
    "add",
    options.source,
    "--agent",
    options.agent,
    "--skill",
    "*",
    "-y",
    "--copy",
  ], project);
  await ensureSuccess(result, "O gerenciador skills não concluiu a instalação");
}

async function runInstalledScript(
  runner,
  project,
  skill,
  relativeScript,
  args,
) {
  const script = await locateSkillScript(project, skill, relativeScript);
  if (!script) {
    throw new Error(
      `A skill ${skill} não está instalada. Execute brandfy init primeiro.`,
    );
  }
  const result = await runner.runScript(script, args, project);
  await ensureSuccess(result, `O script da skill ${skill} falhou`);
}

/**
 * Executa um comando com dependências injetáveis para permitir testes isolados.
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
  if (argv[0] === "--version" || argv[0] === "-v" || argv[0] === "version") {
    stdout(packageManifest.version);
    return 0;
  }

  const { positional, passthrough, options } = parseArguments(argv);
  const [command, subcommand, possibleProject] = positional;

  if (command === "skills" && subcommand === "list") {
    const result = await runner.runSkills(
      ["add", options.source, "--list"],
      cwd,
    );
    await ensureSuccess(result, "Não foi possível listar as skills");
    return 0;
  }

  if (
    command === "skills"
    && (subcommand === "install" || subcommand === "update")
  ) {
    const project = projectFrom(possibleProject, cwd);
    await installSkills(
      runner,
      project,
      options,
      subcommand === "install" ? "Instalando" : "Atualizando",
    );
    return 0;
  }

  const project = projectFrom(subcommand, cwd);
  if (command === "init") {
    await installSkills(runner, project, options, "Instalando");
    await runInstalledScript(
      runner,
      project,
      "brandfy-setup",
      "scripts/setup.mjs",
      ["--project", project],
    );
    stdout(`Brandfy preparado em ${project}.`);
    return 0;
  }

  if (command === "doctor") {
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

  if (command === "pdf") {
    await runInstalledScript(
      runner,
      project,
      "brandfy-guia-pdf",
      "scripts/build-brand-guide.mjs",
      ["--project", project, ...passthrough],
    );
    return 0;
  }

  if (command === "audit") {
    await runInstalledScript(
      runner,
      project,
      "brandfy-auditoria",
      "scripts/audit-brand.mjs",
      ["--project", project, ...passthrough],
    );
    return 0;
  }

  if (command === "update") {
    await installSkills(runner, project, options, "Atualizando");
    await runInstalledScript(
      runner,
      project,
      "brandfy-setup",
      "scripts/setup.mjs",
      ["--project", project, "--check"],
    );
    stdout(`Skills atualizadas e setup conferido em ${project}.`);
    return 0;
  }

  throw new Error(`Comando desconhecido: ${command || "(vazio)"}`);
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
