/**
 * Rasteriza os SVGs aprovados e cria um manifesto verificável dos ativos.
 *
 * O script usa ImageMagick porque ele preserva transparência e permite
 * inspecionar as dimensões sem adicionar dependências ao projeto consumidor.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

function parseArguments(argv) {
  const options = {
    input: "brand/logo/svg",
    output: "brand/logo/png",
    manifest: "brand/manifest.json",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (["--input", "--output", "--manifest"].includes(argument)) {
      options[argument.slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argument}`);
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
  return result.stdout.trim();
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

function dimensions(filePath) {
  const output = run("magick", ["identify", "-format", "%w %h", filePath]);
  const [width, height] = output.split(/\s+/).map(Number);
  return { width, height };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  const manifestPath = path.resolve(options.manifest);

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
    const sourceDimensions = dimensions(source);

    assets.push({
      path: path.relative(path.dirname(manifestPath), source),
      format: "svg",
      role: stem,
      ...sourceDimensions,
      sha256: await sha256(source),
    });

    for (const width of widths) {
      const target = path.join(output, `${stem}-${width}w.png`);
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

      assets.push({
        path: path.relative(path.dirname(manifestPath), target),
        format: "png",
        role: stem,
        ...dimensions(target),
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
