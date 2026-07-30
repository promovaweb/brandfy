/**
 * Confere a navegação e a cobertura da documentação oficial do Brandfy.
 *
 * A validação mantém o guia do usuário compatível com o build do ebook e
 * encontra links relativos quebrados antes que o Pandoc remova o destino.
 */

import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.join(root, "docs");
const orderFile = path.join(docsRoot, "reading-order.txt");

/**
 * Percorre um diretório e retorna os arquivos Markdown encontrados.
 *
 * @param {string} directory Diretório inicial.
 * @returns {Promise<string[]>} Caminhos absolutos ordenados.
 */
async function listMarkdown(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdown(target));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(target);
    }
  }
  return files.sort();
}

/**
 * Extrai destinos relativos escritos com a sintaxe comum de links Markdown.
 *
 * @param {string} source Conteúdo Markdown.
 * @returns {string[]} Destinos encontrados.
 */
function markdownLinks(source) {
  return [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
    .map((match) => match[1])
    .filter((target) => !target.startsWith("#"))
    .filter((target) => !/^[a-z]+:/i.test(target));
}

async function main() {
  const errors = [];
  const ordered = (await readFile(orderFile, "utf8"))
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  const expected = (await listMarkdown(docsRoot))
    .map((file) => path.relative(root, file).split(path.sep).join("/"));

  if (new Set(ordered).size !== ordered.length) {
    errors.push("reading-order.txt contém páginas duplicadas.");
  }

  for (const file of expected) {
    if (!ordered.includes(file)) {
      errors.push(`Página da documentação fora da ordem de leitura: ${file}.`);
    }
  }

  for (const file of ordered) {
    if (!expected.includes(file)) {
      errors.push(`Página ordenada não existe ou não é Markdown: ${file}.`);
    }
  }

  for (const file of await listMarkdown(docsRoot)) {
    const source = await readFile(file, "utf8");
    if (!source.startsWith("# ")) {
      errors.push(`${path.relative(root, file)} precisa começar com H1.`);
    }
    for (const target of markdownLinks(source)) {
      const cleanTarget = target.split("#", 1)[0];
      if (!cleanTarget) continue;
      try {
        await access(path.resolve(path.dirname(file), cleanTarget));
      } catch {
        errors.push(
          `${path.relative(root, file)} aponta para arquivo ausente: ${target}.`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }

  console.log(
    `Documentação validada: ${expected.length} capítulos na edição portátil.`,
  );
}

await main();
