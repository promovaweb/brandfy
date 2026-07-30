/**
 * Gera CSS, JSON, tema Tailwind e relatório de contraste a partir da paleta.
 *
 * A paleta editável permanece em .brandfy. Os arquivos escritos em brand são
 * saídas derivadas e podem ser recompilados sempre que uma cor mudar.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseArguments(argv) {
  const options = { input: ".brandfy/palette.json", output: "brand" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--input" || argv[index] === "--output") {
      options[argv[index].slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${argv[index]}`);
    }
  }
  return options;
}

function normalizeHex(value, label) {
  if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Cor inválida em ${label}: ${value}`);
  }
  return value.toUpperCase();
}

function rgb(hex) {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

function luminance(hex) {
  const channels = rgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function kebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function renderCss(palette, sourceLabel) {
  const familyLines = Object.entries(palette.families)
    .flatMap(([family, scale]) =>
      Object.entries(scale).map(
        ([step, value]) => `  --color-${family}-${step}: ${value};`,
      ),
    )
    .join("\n");

  const semantic = (mode, indentation = "  ") =>
    Object.entries(palette[mode])
      .map(
        ([name, value]) =>
          `${indentation}--color-${kebab(name)}: ${value};`,
      )
      .join("\n");

  return `/**
 * Design tokens gerados pelo Brandfy.
 *
 * Edite ${sourceLabel} e execute novamente o gerador. Alterações feitas somente
 * neste arquivo serão substituídas na próxima compilação.
 */

@import "./fonts/fonts.css";

:root {
${familyLines}
${semantic("light")}
}

.dark,
:root[data-theme="dark"] {
${semantic("dark")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${semantic("dark", "    ")}
  }
}
`;
}

function renderTailwind(palette, sourceLabel) {
  const families = Object.fromEntries(
    Object.entries(palette.families).map(([family, scale]) => [
      family,
      Object.fromEntries(
        Object.keys(scale).map((step) => [
          step,
          `var(--color-${family}-${step})`,
        ]),
      ),
    ]),
  );
  const semantic = Object.fromEntries(
    Object.keys(palette.light).map((name) => [
      kebab(name),
      `var(--color-${kebab(name)})`,
    ]),
  );

  return `/**
 * Tema Tailwind gerado pelo Brandfy.
 *
 * Fonte editável: ${sourceLabel}.
 * Importe colors em theme.extend.colors no Tailwind CSS 3 ou use os mesmos
 * tokens em @theme quando o projeto adotar Tailwind CSS 4.
 */

export const colors = ${JSON.stringify({ ...families, ...semantic }, null, 2)};

export default {
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
        mono: ["var(--font-mono)"]
      }
    }
  }
};
`;
}

function buildChecks(palette) {
  const checks = [];
  for (const mode of ["light", "dark"]) {
    const values = palette[mode];
    const pairs = [
      ["text", "background", 4.5, "texto principal"],
      ["text", "surface", 4.5, "texto principal em superfície"],
      ["textMuted", "background", 4.5, "texto secundário"],
      ["accent", "background", 4.5, "acento usado como texto"],
      ["focus", "background", 3, "indicador de foco"],
    ];

    for (const [foregroundName, backgroundName, minimum, label] of pairs) {
      const ratio = contrast(values[foregroundName], values[backgroundName]);
      checks.push({
        mode,
        label,
        foreground: values[foregroundName],
        background: values[backgroundName],
        ratio,
        minimum,
        passed: ratio >= minimum,
      });
    }
  }
  return checks;
}

function renderAccessibility(checks, sourceLabel) {
  const rows = checks
    .map(
      (check) =>
        `| ${check.mode} | ${check.label} | \`${check.foreground}\` | \`${check.background}\` | ${check.ratio.toFixed(2)}:1 | ${check.minimum}:1 | ${check.passed ? "Aprovado" : "Reprovado"} |`,
    )
    .join("\n");

  return `# Acessibilidade das cores

Este relatório foi calculado pelo Brandfy a partir de
\`${sourceLabel}\`. Uma aprovação numérica não substitui o teste do
componente, dos estados e do arquivo rasterizado.

| Modo | Uso | Primeiro plano | Fundo | Proporção | Mínimo | Resultado |
| --- | --- | --- | --- | ---: | ---: | --- |
${rows}
`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  const sourceLabel = path.relative(process.cwd(), input) || path.basename(input);
  const source = JSON.parse(await readFile(input, "utf8"));

  for (const [family, scale] of Object.entries(source.families ?? {})) {
    for (const [step, value] of Object.entries(scale)) {
      scale[step] = normalizeHex(value, `families.${family}.${step}`);
    }
  }
  for (const mode of ["light", "dark"]) {
    if (!source[mode]) throw new Error(`Modo ausente: ${mode}`);
    for (const [name, value] of Object.entries(source[mode])) {
      source[mode][name] = normalizeHex(value, `${mode}.${name}`);
    }
  }

  const checks = buildChecks(source);
  const failures = checks.filter((check) => !check.passed);
  if (failures.length > 0) {
    throw new Error(
      `A paleta falhou em ${failures.length} combinação(ões): ${failures
        .map((check) => `${check.mode}/${check.label}`)
        .join(", ")}`,
    );
  }

  await mkdir(output, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(output, "global.css"),
      renderCss(source, sourceLabel),
      "utf8",
    ),
    writeFile(
      path.join(output, "tokens.json"),
      `${JSON.stringify(source, null, 2)}\n`,
      "utf8",
    ),
    writeFile(
      path.join(output, "tailwind-theme.js"),
      renderTailwind(source, sourceLabel),
      "utf8",
    ),
    writeFile(
      path.join(output, "accessibility.md"),
      renderAccessibility(checks, sourceLabel),
      "utf8",
    ),
  ]);

  console.log(`Tokens gerados em ${output}.`);
}

await main();
