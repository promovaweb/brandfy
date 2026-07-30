/**
 * Copia os templates editáveis da skill para o diretório da marca.
 *
 * Arquivos existentes são preservados. Use --force somente quando a pessoa
 * responsável autorizar a reposição pelos exemplos originais.
 */

import { copyFile, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArguments(argv) {
  const options = { output: "brand/templates", force: false };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--output") {
      options.output = argv[index + 1];
      index += 1;
    } else if (argv[index] === "--force") {
      options.force = true;
    } else {
      throw new Error(`Argumento desconhecido: ${argv[index]}`);
    }
  }
  return options;
}

const options = parseArguments(process.argv.slice(2));
const source = path.join(skillRoot, "assets");
const output = path.resolve(options.output);
await mkdir(output, { recursive: true });

for (const entry of await readdir(source, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".svg")) continue;
  await copyFile(
    path.join(source, entry.name),
    path.join(output, entry.name),
    options.force ? 0 : 1,
  ).catch((error) => {
    if (error.code !== "EEXIST") throw error;
  });
}

console.log(`Templates disponíveis em ${output}.`);
