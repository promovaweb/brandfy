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

const ESQUEMAS_TOLERANCIA = {
  monocromatica: { alvo: 0, tolerancia: 8 },
  analoga: { alvo: 30, tolerancia: 8 },
  complementar: { alvo: 180, tolerancia: 15 },
  "split-complementar": { alvo: 150, tolerancia: 15 },
  triade: { alvo: 120, tolerancia: 8 },
  tetradica: { alvo: 60, tolerancia: 8 },
};

function hexToHue(hex) {
  const [r, g, b] = rgb(hex).map((value) => value / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  return hue < 0 ? hue + 360 : hue;
}

function hueDelta(a, b) {
  const raw = Math.abs(a - b) % 360;
  return raw > 180 ? 360 - raw : raw;
}

function buildHarmonyCheck(palette) {
  const harmony = palette.harmony;
  if (!harmony || !palette.families?.primary?.["500"] || !palette.families?.accent?.["500"]) {
    return null;
  }
  const regra = ESQUEMAS_TOLERANCIA[harmony.scheme];
  if (!regra) {
    throw new Error(
      `Esquema de harmonia desconhecido: ${harmony.scheme}. Use um valor de circulo-cromatico.md.`,
    );
  }
  const primaryHue = hexToHue(palette.families.primary["500"]);
  const accentHue = hexToHue(palette.families.accent["500"]);
  const delta = hueDelta(primaryHue, accentHue);
  const desvio = Math.abs(delta - regra.alvo);
  return {
    scheme: harmony.scheme,
    primaryHue,
    accentHue,
    delta,
    alvo: regra.alvo,
    tolerancia: regra.tolerancia,
    passed: desvio <= regra.tolerancia,
  };
}

function renderHarmony(check, sourceLabel) {
  const status = check.passed ? "Aprovado" : "Reprovado";
  return `# Harmonia cromática

Este relatório foi calculado pelo Brandfy a partir de \`${sourceLabel}\`,
segundo o círculo cromático descrito em circulo-cromatico.md.

| Esquema | Matiz primary.500 | Matiz accent.500 | Distância angular | Alvo | Tolerância | Resultado |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| ${check.scheme} | ${check.primaryHue.toFixed(1)}° | ${check.accentHue.toFixed(1)}° | ${check.delta.toFixed(1)}° | ${check.alvo}° | ±${check.tolerancia}° | ${status} |

Uma aprovação angular não substitui o teste visual das rotas nem o contraste
de acessibilidade em \`accessibility.md\`.
`;
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

  const harmonyCheck = buildHarmonyCheck(source);
  if (harmonyCheck && !harmonyCheck.passed) {
    throw new Error(
      `A relação de matiz entre primary e accent (${harmonyCheck.delta.toFixed(1)}°) não corresponde ao esquema "${harmonyCheck.scheme}" (alvo ${harmonyCheck.alvo}° ± ${harmonyCheck.tolerancia}°).`,
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
    ...(harmonyCheck
      ? [
          writeFile(
            path.join(output, "color-harmony.md"),
            renderHarmony(harmonyCheck, sourceLabel),
            "utf8",
          ),
        ]
      : []),
  ]);

  console.log(`Tokens gerados em ${output}.`);
}

await main();
