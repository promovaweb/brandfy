/**
 * Audita a estrutura final da marca e escreve um relatório reproduzível.
 *
 * A auditoria não corrige arquivos. Ela aponta ausências, inconsistências
 * estruturais e verificações humanas que ainda precisam ser registradas.
 */

import { createHash } from "node:crypto";
import { access, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

function parseArguments(argv) {
  const options = {
    project: ".",
    config: ".brandfy/config.yaml",
    report: ".brandfy/audit.md",
  };
  for (let index = 0; index < argv.length; index += 1) {
    if (["--project", "--config", "--report"].includes(argv[index])) {
      options[argv[index].slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argv[index]}`);
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

function readYamlScalar(source, key, fallback) {
  const match = source.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"));
  return match ? match[1].trim() : fallback;
}

async function listFiles(directory, extension) {
  if (!(await exists(directory))) return [];
  return (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

function imageDimensions(filePath) {
  const result = spawnSync(
    "magick",
    ["identify", "-format", "%w %h", filePath],
    { encoding: "utf8" },
  );
  if (result.status !== 0) return null;
  const [width, height] = result.stdout.trim().split(/\s+/).map(Number);
  return { width, height };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const project = path.resolve(options.project);
  const configPath = path.resolve(project, options.config);
  const reportPath = path.resolve(project, options.report);
  const failures = [];
  const warnings = [];
  const evidence = [];

  if (!(await exists(configPath))) {
    throw new Error(`Configuração ausente: ${configPath}`);
  }

  const config = await readFile(configPath, "utf8");
  const brandDirectory = readYamlScalar(config, "brand_directory", "brand");
  const brand = path.resolve(project, brandDirectory);

  const requiredFiles = [
    "README.md",
    "global.css",
    "tokens.json",
    "tailwind-theme.js",
    "manifest.json",
    "accessibility.md",
    "voice.md",
    "strategy.md",
    "brand-guide.pdf",
  ];

  for (const relativePath of requiredFiles) {
    const target = path.join(brand, relativePath);
    if (!(await exists(target))) {
      failures.push(`Arquivo obrigatório ausente: ${brandDirectory}/${relativePath}.`);
    } else if ((await stat(target)).size === 0) {
      failures.push(`Arquivo vazio: ${brandDirectory}/${relativePath}.`);
    } else {
      evidence.push(`${brandDirectory}/${relativePath}`);
    }
  }

  const svgFiles = await listFiles(path.join(brand, "logo", "svg"), ".svg");
  const pngFiles = await listFiles(path.join(brand, "logo", "png"), ".png");
  if (svgFiles.length < 4) {
    failures.push("O sistema de logo precisa de ao menos quatro variantes em SVG.");
  }
  if (pngFiles.length < 4) {
    failures.push("O sistema de logo precisa de ao menos quatro exportações em PNG.");
  }

  const requiredRoles = ["light", "dark"];
  for (const role of requiredRoles) {
    if (![...svgFiles, ...pngFiles].some((file) => path.basename(file).includes(role))) {
      failures.push(`Variante ${role} do logo não encontrada.`);
    }
  }

  for (const svg of svgFiles) {
    const source = await readFile(svg, "utf8");
    if (!source.includes("<svg") || !source.includes("viewBox=")) {
      failures.push(`${path.relative(project, svg)} não possui SVG e viewBox válidos.`);
    }
    if (/<image\b/i.test(source)) {
      warnings.push(`${path.relative(project, svg)} incorpora imagem raster.`);
    }
  }

  for (const png of pngFiles.slice(0, 12)) {
    const dimensions = imageDimensions(png);
    if (!dimensions || dimensions.width < 16 || dimensions.height < 16) {
      failures.push(`Dimensão inválida em ${path.relative(project, png)}.`);
    }
  }

  const manifestPath = path.join(brand, "manifest.json");
  if (await exists(manifestPath)) {
    try {
      const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
      for (const asset of manifest.assets ?? []) {
        const target = path.resolve(brand, asset.path);
        if (!(await exists(target))) {
          failures.push(`Ativo do manifesto ausente: ${asset.path}.`);
        } else if (asset.sha256 && (await sha256(target)) !== asset.sha256) {
          failures.push(`Hash divergente no manifesto: ${asset.path}.`);
        }
      }
    } catch (error) {
      failures.push(`Manifesto inválido: ${error.message}.`);
    }
  }

  const manualPath = path.join(brand, "README.md");
  if (await exists(manualPath)) {
    const manual = await readFile(manualPath, "utf8");
    for (const heading of [
      "Missão",
      "Visão",
      "Valores",
      "Voz",
      "Logo",
      "Cores",
      "Tipografia",
      "Acessibilidade",
      "Governança",
    ]) {
      if (!manual.toLocaleLowerCase("pt-BR").includes(heading.toLocaleLowerCase("pt-BR"))) {
        warnings.push(`O manual não menciona ${heading}.`);
      }
    }
  }

  const status = failures.length === 0 ? "Aprovado estruturalmente" : "Reprovado";
  const renderList = (items, empty) =>
    items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${empty}`;
  const report = `# Auditoria da marca

**Resultado:** ${status}

## Reprovações

${renderList(failures, "Nenhuma reprovação estrutural.")}

## Avisos

${renderList(warnings, "Nenhum aviso estrutural.")}

## Evidências encontradas

${renderList(evidence, "Nenhum arquivo obrigatório confirmado.")}

## Conferência humana obrigatória

- Abrir SVGs e PNGs nos modos light e dark.
- Conferir área de proteção, tamanho mínimo, redução e monocromia.
- Revisar contraste nos componentes e nos arquivos rasterizados.
- Confirmar autoria, licença, consentimento de imagem e pesquisa do nome.
- Abrir o PDF, os templates sociais, o cabeçalho de email e as peças do YouTube.
`;

  await writeFile(reportPath, report, "utf8");
  console.log(`Auditoria registrada em ${reportPath}.`);
  if (failures.length > 0) process.exitCode = 1;
}

await main();
