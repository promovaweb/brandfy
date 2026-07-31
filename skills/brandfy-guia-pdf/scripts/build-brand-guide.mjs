/**
 * Instala o kit global e compila o manual Markdown em PDF.
 *
 * O projeto consumidor recebe uma cópia editável em `brand/pdf/`. Arquivos
 * existentes são preservados por padrão, enquanto `--force-assets` permite
 * atualizar conscientemente o kit para a versão distribuída pela skill.
 */

import {
  access,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundledAssets = path.join(skillRoot, "assets", "pdf-design-system");

function parseArguments(argv) {
  const options = {
    project: ".",
    input: "brand/README.md",
    output: "brand/brand-guide.pdf",
    css: "brand/pdf/pdf.css",
    template: "brand/pdf/template.html",
    brandName: "",
    title: "",
    tagline: "",
    description: "",
    logo: "",
    installAssets: false,
    forceAssets: false,
  };
  const valueArguments = new Map([
    ["--project", "project"],
    ["--input", "input"],
    ["--output", "output"],
    ["--css", "css"],
    ["--template", "template"],
    ["--brand-name", "brandName"],
    ["--title", "title"],
    ["--tagline", "tagline"],
    ["--description", "description"],
    ["--logo", "logo"],
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--install-assets") {
      options.installAssets = true;
    } else if (argument === "--force-assets") {
      options.forceAssets = true;
    } else if (valueArguments.has(argument)) {
      options[valueArguments.get(argument)] = argv[index + 1];
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

/**
 * Copia recursivamente o kit, preservando personalizações por padrão.
 *
 * @param {string} source Diretório distribuído pela skill.
 * @param {string} target Diretório do projeto consumidor.
 * @param {boolean} force Substitui arquivos quando verdadeiro.
 * @returns {Promise<{copied: number, preserved: number}>} Contagem da operação.
 */
async function copyAssets(source, target, force) {
  const result = { copied: 0, preserved: 0 };
  await mkdir(target, { recursive: true });

  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      const nested = await copyAssets(sourcePath, targetPath, force);
      result.copied += nested.copied;
      result.preserved += nested.preserved;
    } else if (!force && await exists(targetPath)) {
      result.preserved += 1;
    } else {
      await copyFile(sourcePath, targetPath);
      result.copied += 1;
    }
  }

  return result;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${command} falhou: ${(result.stderr || result.stdout).trim()}`,
    );
  }
}

function firstHeading(markdown) {
  return markdown.match(/^#\s+(.+)$/mu)?.[1]?.trim() || "Manual da marca";
}

function firstParagraph(markdown) {
  return markdown
    .split(/\n\s*\n/u)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("![")) || "";
}

async function detectLogo(projectRoot, explicitLogo) {
  const candidates = [
    explicitLogo,
    "brand/logo/svg/icon.svg",
    "brand/logo/icon.svg",
    "brand/logo/icon.png",
    "brand/favicon/icon.svg",
    "brand/favicon/icon.png",
  ].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = path.isAbsolute(candidate)
      ? candidate
      : path.resolve(projectRoot, candidate);
    if (await exists(resolved)) return resolved;
  }
  return "";
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const projectRoot = path.resolve(options.project);
  const assetTarget = path.join(projectRoot, "brand", "pdf");
  const copyResult = await copyAssets(
    bundledAssets,
    assetTarget,
    options.forceAssets,
  );

  console.log(
    `Kit de PDF: ${copyResult.copied} arquivo(s) copiado(s), ${copyResult.preserved} preservado(s).`,
  );

  if (options.installAssets) return;

  const resolveProjectPath = (filePath) => path.isAbsolute(filePath)
    ? filePath
    : path.resolve(projectRoot, filePath);
  const input = resolveProjectPath(options.input);
  const output = resolveProjectPath(options.output);
  const css = resolveProjectPath(options.css);
  const template = resolveProjectPath(options.template);
  const markdown = await readFile(input, "utf8");
  const title = options.title || firstHeading(markdown);
  const brandName = options.brandName || title
    .replace(/^Manual (?:da|de) (?:marca )?/iu, "")
    .trim();
  const description = options.description || firstParagraph(markdown);
  const logo = await detectLogo(projectRoot, options.logo);
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "brandfy-pdf-"));
  const html = path.join(temporaryRoot, "brand-guide.html");
  const date = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const resourcePath = [
    projectRoot,
    path.dirname(input),
    path.join(projectRoot, "brand"),
    assetTarget,
  ].join(path.delimiter);

  try {
    const variables = [
      ["brand_name", brandName],
      ["document_type", "Manual da marca"],
      ["tagline", options.tagline],
      ["description", description],
      ["date", date],
      ["source_label", path.relative(projectRoot, input)],
      ["footer_label", `${brandName || title} — Manual da marca`],
      ["logo", logo],
    ].filter(([, value]) => value);
    const pandocArguments = [
      input,
      "--from=gfm",
      "--to=html5",
      "--standalone",
      "--toc",
      "--toc-depth=2",
      "--embed-resources",
      `--resource-path=${resourcePath}`,
      `--template=${template}`,
      `--css=${css}`,
      `--metadata=title:${title}`,
      "--metadata=lang:pt-BR",
      ...variables.map(([name, value]) => `--variable=${name}:${value}`),
      "--output",
      html,
    ];

    run("pandoc", pandocArguments, projectRoot);
    await mkdir(path.dirname(output), { recursive: true });
    run("weasyprint", [html, output, "--base-url", projectRoot], projectRoot);
    console.log(`Guia compilado em ${output}.`);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

await main();
