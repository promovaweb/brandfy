/**
 * Confere o contrato de uma release total do Brandfy.
 *
 * O comando valida igualdade de versões, entrada no changelog, metadados do
 * pacote público e presença dos arquivos usados pela publicação.
 */

import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

const [framework, cli, cliLock, ebookVersion, changelog] = await Promise.all([
  readJson("package.json"),
  readJson("cli/package.json"),
  readJson("cli/package-lock.json"),
  readFile(path.join(root, "ebooks", "VERSION"), "utf8"),
  readFile(path.join(root, "CHANGELOG.md"), "utf8"),
]);
const version = framework.version;
const versions = new Map([
  ["package.json", version],
  ["cli/package.json", cli.version],
  ["cli/package-lock.json", cliLock.version],
  ["cli/package-lock.json#packages", cliLock.packages?.[""]?.version],
  ["ebooks/VERSION", ebookVersion.trim()],
]);

for (const [source, found] of versions) {
  if (found !== version) {
    errors.push(`${source} usa ${found}, mas a release usa ${version}.`);
  }
}

if (cli.name !== "@promovaweb/brandfy") {
  errors.push("O pacote público precisa se chamar @promovaweb/brandfy.");
}
if (cli.private === true) {
  errors.push("O pacote do CLI não pode estar marcado como privado.");
}
if (cli.bin?.brandfy !== "bin/brandfy.mjs") {
  errors.push("O manifesto do CLI não expõe o binário brandfy esperado.");
}
if (!changelog.includes(`## [${version}]`)) {
  errors.push(`O CHANGELOG.md não possui uma seção para ${version}.`);
}

for (const relativePath of [
  "CHANGELOG.md",
  "RELEASING.md",
  "cli/README.md",
  "cli/bin/brandfy.mjs",
  "cli/src/cli.mjs",
  "cli/tests/cli.test.mjs",
]) {
  try {
    await access(path.join(root, relativePath));
  } catch {
    errors.push(`Arquivo obrigatório da release ausente: ${relativePath}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Release ${version} validada com versão única.`);
}
