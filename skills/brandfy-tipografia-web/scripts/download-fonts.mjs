/**
 * Baixa webfonts autorizadas e gera as declarações @font-face da marca.
 *
 * O manifesto precisa registrar licença e origem. O script recusa URLs sem
 * HTTPS e confere SHA-256 quando o responsável fornece um hash.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseArguments(argv) {
  const options = { manifest: ".brandfy/fonts.json", output: "brand/fonts" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--manifest" || argv[index] === "--output") {
      options[argv[index].slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argv[index]}`);
    }
  }
  return options;
}

function safeFileName(value) {
  if (path.basename(value) !== value || !/^[a-zA-Z0-9._-]+$/.test(value)) {
    throw new Error(`Nome de arquivo inválido: ${value}`);
  }
  return value;
}

function fontFace(family, file) {
  const format = file.format ?? path.extname(file.file).slice(1);
  const ranges = file.unicodeRange ? `\n  unicode-range: ${file.unicodeRange};` : "";
  return `@font-face {
  font-family: "${family.name}";
  src: url("./${file.file}") format("${format}");
  font-style: ${file.style ?? "normal"};
  font-weight: ${file.weight ?? "100 900"};
  font-display: swap;${ranges}
}`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const manifest = JSON.parse(await readFile(path.resolve(options.manifest), "utf8"));
  const output = path.resolve(options.output);
  await mkdir(output, { recursive: true });

  const css = [];
  const fallbacks = {};

  for (const family of manifest.families ?? []) {
    if (!family.name || !family.license) {
      throw new Error("Cada família precisa declarar name e license.");
    }
    fallbacks[family.role ?? "body"] = `"${family.name}", ${family.fallback ?? "sans-serif"}`;

    for (const file of family.files ?? []) {
      safeFileName(file.file);
      if (!file.url?.startsWith("https://")) {
        throw new Error(`A fonte ${file.file} precisa usar uma URL HTTPS direta.`);
      }
      if (!file.license) {
        throw new Error(`A fonte ${file.file} precisa registrar sua licença.`);
      }

      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Falha ao baixar ${file.url}: HTTP ${response.status}.`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      const digest = createHash("sha256").update(bytes).digest("hex");
      if (file.sha256 && file.sha256.toLowerCase() !== digest) {
        throw new Error(`SHA-256 divergente para ${file.file}.`);
      }
      await writeFile(path.join(output, file.file), bytes);
      css.push(fontFace(family, file));
    }
  }

  const tokenCss = `:root {
  --font-heading: ${fallbacks.heading ?? fallbacks.body ?? "sans-serif"};
  --font-body: ${fallbacks.body ?? "sans-serif"};
  --font-interface: ${fallbacks.interface ?? fallbacks.body ?? "sans-serif"};
  --font-mono: ${fallbacks.mono ?? "ui-monospace, monospace"};
}
`;
  await writeFile(
    path.join(output, "fonts.css"),
    `/**\n * Webfonts e tokens tipográficos gerados pelo Brandfy.\n */\n\n${css.join("\n\n")}${css.length ? "\n\n" : ""}${tokenCss}`,
    "utf8",
  );
  console.log(`Tipografia preparada em ${output}.`);
}

await main();
