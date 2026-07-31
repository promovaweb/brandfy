/**
 * Executa o gerenciador `skills` e os scripts instalados pelo Brandfy.
 *
 * A resolução parte da dependência empacotada, portanto o CLI não depende de
 * um comando `skills` global nem baixa uma versão diferente a cada execução.
 */

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * Executa um processo filho com o terminal herdado.
 *
 * @param {string} command Executável que será iniciado.
 * @param {string[]} args Argumentos entregues ao executável.
 * @param {string} cwd Diretório usado durante a execução.
 * @param {"inherit" | "pipe"} stdio Forma de encaminhar a saída.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>}
 */
export function runProcess(command, args, cwd, stdio = "inherit") {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: stdio === "inherit" ? "inherit" : ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    let stdout = "";
    let stderr = "";

    if (stdio === "pipe") {
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
    }

    child.once("error", reject);
    child.once("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

/**
 * Localiza o binário distribuído pela dependência npm `skills`.
 *
 * @returns {Promise<string>} Caminho absoluto do arquivo executável.
 */
export async function resolveSkillsCli() {
  const packagePath = require.resolve("skills/package.json");
  const manifest = JSON.parse(await readFile(packagePath, "utf8"));
  const relativeBin = typeof manifest.bin === "string"
    ? manifest.bin
    : manifest.bin?.skills;

  if (!relativeBin) {
    throw new Error("A dependência skills não expõe o executável esperado.");
  }

  return path.resolve(path.dirname(packagePath), relativeBin);
}

/**
 * Cria o adaptador usado pelos comandos do Brandfy.
 *
 * @returns {{runSkills: Function, runScript: Function}} Adaptador de processos.
 */
export function createProcessRunner() {
  return {
    async runSkills(args, cwd, stdio = "inherit") {
      const executable = await resolveSkillsCli();
      return runProcess(process.execPath, [executable, ...args], cwd, stdio);
    },
    runScript(script, args, cwd, stdio = "inherit") {
      return runProcess(process.execPath, [script, ...args], cwd, stdio);
    },
  };
}
