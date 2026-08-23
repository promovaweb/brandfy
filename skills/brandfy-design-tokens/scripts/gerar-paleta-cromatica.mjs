/**
 * Gera families.primary e families.accent de um palette.json a partir do
 * círculo cromático: uma cor-base em HSL e um esquema de harmonia definem o
 * matiz de cada família, e uma escala fixa de luminosidade/saturação deriva
 * os 11 tons (50 a 950) de cada uma.
 *
 * Ciência de cor primeiro, hex manual depois: este script não decide tokens
 * semânticos (light/dark), só as famílias de origem e o campo `harmony`.
 * Consulte references/circulo-cromatico.md para o raciocínio.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ESQUEMAS = {
  monocromatica: (hue) => ({ primary: hue, accent: hue }),
  analoga: (hue) => ({ primary: hue, accent: normalizeHue(hue + 30) }),
  complementar: (hue) => ({ primary: hue, accent: normalizeHue(hue + 180) }),
  "split-complementar": (hue) => ({
    primary: hue,
    accent: normalizeHue(hue + 150),
  }),
  triade: (hue) => ({ primary: hue, accent: normalizeHue(hue + 120) }),
  tetradica: (hue) => ({ primary: hue, accent: normalizeHue(hue + 60) }),
};

const ESCALA = [
  { step: "50", lightness: 95, saturationDelta: -15 },
  { step: "100", lightness: 90, saturationDelta: -10 },
  { step: "200", lightness: 80, saturationDelta: -5 },
  { step: "300", lightness: 70, saturationDelta: 0 },
  { step: "400", lightness: 60, saturationDelta: 0 },
  { step: "500", lightness: null, saturationDelta: 0 },
  { step: "600", lightness: 40, saturationDelta: 5 },
  { step: "700", lightness: 30, saturationDelta: 5 },
  { step: "800", lightness: 22, saturationDelta: 0 },
  { step: "900", lightness: 14, saturationDelta: -5 },
  { step: "950", lightness: 8, saturationDelta: -10 },
];

function normalizeHue(hue) {
  return ((hue % 360) + 360) % 360;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseArguments(argv) {
  const options = {
    output: ".brandfy/palette.json",
    hue: null,
    saturation: 60,
    lightness: 45,
    scheme: null,
    name: "Marca",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--hue" || flag === "--saturation" || flag === "--lightness") {
      options[flag.slice(2)] = Number(argv[index + 1]);
      index += 1;
    } else if (flag === "--scheme" || flag === "--output" || flag === "--name") {
      options[flag.slice(2)] = argv[index + 1];
      index += 1;
    } else {
      throw new Error(`Argumento desconhecido: ${flag}`);
    }
  }
  if (options.hue === null || Number.isNaN(options.hue)) {
    throw new Error("Informe --hue (0 a 360), o matiz-base de families.primary.500.");
  }
  if (!options.scheme || !ESQUEMAS[options.scheme]) {
    throw new Error(
      `Informe --scheme com um dos valores: ${Object.keys(ESQUEMAS).join(", ")}.`,
    );
  }
  return options;
}

function hslToHex(hue, saturation, lightness) {
  const h = normalizeHue(hue) / 360;
  const s = clamp(saturation, 0, 100) / 100;
  const l = clamp(lightness, 0, 100) / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return toHex(gray, gray, gray);
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const toChannel = (t) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };

  const r = Math.round(toChannel(h + 1 / 3) * 255);
  const g = Math.round(toChannel(h) * 255);
  const b = Math.round(toChannel(h - 1 / 3) * 255);
  return toHex(r, g, b);
}

function toHex(r, g, b) {
  return `#${[r, g, b].map((channel) => clamp(channel, 0, 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function buildFamily(hue, baseSaturation, baseLightness) {
  const scale = {};
  for (const { step, lightness, saturationDelta } of ESCALA) {
    const finalLightness = lightness === null ? baseLightness : lightness;
    const finalSaturation = clamp(baseSaturation + saturationDelta, 0, 100);
    scale[step] = hslToHex(hue, finalSaturation, finalLightness);
  }
  return scale;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const hues = ESQUEMAS[options.scheme](normalizeHue(options.hue));

  const families = {
    primary: buildFamily(hues.primary, options.saturation, options.lightness),
    accent: buildFamily(hues.accent, options.saturation, options.lightness),
  };

  const output = path.resolve(options.output);
  let existing = {};
  try {
    existing = JSON.parse(await readFile(output, "utf8"));
  } catch {
    existing = { name: options.name };
  }

  const palette = {
    ...existing,
    name: existing.name ?? options.name,
    harmony: {
      scheme: options.scheme,
      baseHue: normalizeHue(options.hue),
      accentHue: hues.accent,
    },
    families: {
      ...existing.families,
      primary: families.primary,
      accent: families.accent,
    },
  };

  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(palette, null, 2)}\n`, "utf8");

  console.log(
    `families.primary e families.accent gerados em ${output} pelo esquema "${options.scheme}" (matiz-base ${normalizeHue(options.hue)}°, acento ${hues.accent}°).`,
  );
  console.log(
    "Preencha families.neutral e os modos light/dark antes de rodar generate-tokens.mjs.",
  );
}

await main();
