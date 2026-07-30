/**
 * Compila o manual Markdown em PDF por meio de Pandoc e WeasyPrint.
 *
 * O HTML intermediário vive em um diretório temporário e é removido depois da
 * compilação. A fonte Markdown e os ativos vinculados não são modificados.
 */

import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArguments(argv) {
  const options = {
    input: "brand/README.md",
    output: "brand/brand-guide.pdf",
    css: path.join(skillRoot, "assets", "brand-guide.css"),
  };
  for (let index = 0; index < argv.length; index += 1) {
    if (["--input", "--output", "--css"].includes(argv[index])) {
      options[argv[index].slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argv[index]}`);
    }
  }
  return options;
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${command} falhou: ${(result.stderr || result.stdout).trim()}`,
    );
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  const css = path.resolve(options.css);
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "brandfy-pdf-"));
  const html = path.join(temporaryRoot, "brand-guide.html");

  try {
    run("pandoc", [
      input,
      "--from=gfm",
      "--to=html5",
      "--standalone",
      "--toc",
      "--embed-resources",
      `--resource-path=${path.dirname(input)}`,
      `--css=${css}`,
      "--metadata=title:Manual da marca",
      "--metadata=lang:pt-BR",
      "--output",
      html,
    ]);
    await mkdir(path.dirname(output), { recursive: true });
    run("weasyprint", [html, output]);
    console.log(`Guia compilado em ${output}.`);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

await main();
