/**
 * Rasteriza os SVGs aprovados e cria um manifesto verificável dos ativos.
 *
 * O script usa ImageMagick porque ele preserva transparência e permite
 * inspecionar as dimensões sem adicionar dependências ao projeto consumidor.
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

function parseArguments(argv) {
  const options = {
    input: "brand/logo/svg",
    output: "brand/logo/png",
    manifest: "brand/manifest.json",
    font: "brand/fonts/manrope-variable.ttf",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (["--input", "--output", "--manifest", "--font"].includes(argument)) {
      options[argument.slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
    }
  }

  return options;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(
      `${command} falhou: ${(result.stderr || result.stdout).trim()}`,
    );
  }
  return result.stdout.trim();
}

function attribute(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1];
}

/**
 * Rasteriza um SVG. Quando o lockup preserva um único wordmark como texto, a
 * camada vetorial e o texto são compostos separadamente para evitar a ordem
 * invertida de glifos no renderizador SVG interno do ImageMagick.
 */
async function rasterizeSvg({ source, target, width, fontPath }) {
  const svg = await readFile(source, "utf8");
  const textElement = svg.match(/<text\b([^>]*)>([^<]+)<\/text>/i);

  if (!textElement) {
    run("magick", [
      "-background",
      "none",
      "-density",
      "288",
      source,
      "-resize",
      `${width}x${width}`,
      "-depth",
      "8",
      "-strip",
      target,
    ]);
    return;
  }

  if (!existsSync(fontPath)) {
    throw new Error(
      `O SVG ${source} contém texto, mas a fonte não existe em ${fontPath}.`,
    );
  }

  const attributes = textElement[1];
  const text = textElement[2].trim();
  const fill = attribute(attributes, "fill") ?? "#000000";
  const fontSize = attribute(attributes, "font-size") ?? "16";
  const fontWeight = attribute(attributes, "font-weight") ?? "400";
  const letterSpacing = attribute(attributes, "letter-spacing") ?? "0";
  const x = attribute(attributes, "x") ?? "0";
  const baseSvg = svg.replace(textElement[0], "");

  run(
    "magick",
    [
      "-background",
      "none",
      "svg:-",
      "(",
      "-background",
      "none",
      "-fill",
      fill,
      "-weight",
      fontWeight,
      "-font",
      fontPath,
      "-pointsize",
      fontSize,
      "-kerning",
      letterSpacing,
      `label:${text}`,
      "-trim",
      ")",
      "-gravity",
      "west",
      "-geometry",
      `+${x}+0`,
      "-composite",
      "-resize",
      `${width}x${width}`,
      "-depth",
      "8",
      "-strip",
      target,
    ],
    { input: baseSvg },
  );
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

/**
 * Lê dimensões sem rasterizar o SVG. Isso evita que a inspeção de um lockup
 * com texto dependa das fontes instaladas no ambiente de exportação.
 */
async function dimensions(filePath) {
  if (path.extname(filePath).toLowerCase() === ".svg") {
    const source = await readFile(filePath, "utf8");
    const viewBox = source.match(
      /\bviewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i,
    );
    if (!viewBox) {
      throw new Error(`SVG sem viewBox válido: ${filePath}.`);
    }
    return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  }

  const output = run("magick", ["identify", "-format", "%w %h", filePath]);
  const [width, height] = output.split(/\s+/).map(Number);
  return { width, height };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  const manifestPath = path.resolve(options.manifest);
  const fontPath = path.resolve(options.font);

  run("magick", ["-version"]);
  await mkdir(output, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const svgFiles = (await readdir(input, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".svg"))
    .map((entry) => entry.name)
    .sort();

  if (svgFiles.length === 0) {
    throw new Error(`Nenhum SVG encontrado em ${input}.`);
  }

  const assets = [];
  for (const fileName of svgFiles) {
    const source = path.join(input, fileName);
    const stem = path.basename(fileName, ".svg");
    const compact = /(icon|symbol|mark|favicon|compact)/i.test(stem);
    const widths = compact ? [16, 32, 48, 180, 192, 512] : [512, 1024, 2048];
    const sourceDimensions = await dimensions(source);

    assets.push({
      path: path.relative(path.dirname(manifestPath), source),
      format: "svg",
      role: stem,
      ...sourceDimensions,
      sha256: await sha256(source),
    });

    for (const width of widths) {
      const target = path.join(output, `${stem}-${width}w.png`);
      await rasterizeSvg({
        source,
        target,
        width,
        fontPath,
      });

      assets.push({
        path: path.relative(path.dirname(manifestPath), target),
        format: "png",
        role: stem,
        ...(await dimensions(target)),
        sha256: await sha256(target),
      });
    }
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    assets,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`${assets.length} ativos registrados em ${manifestPath}.`);
}

await main();
