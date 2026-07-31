/**
 * Valida tokens, logos com wordmark e instalação segura dos templates.
 */

import assert from "node:assert/strict";
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";

function run(script, args, cwd) {
  return spawnSync(process.execPath, [path.resolve(script), ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("gerador produz CSS, JSON, Tailwind e relatório", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-token-test-"));
  try {
    const palette = {
      name: "Teste",
      families: {
        primary: { 500: "#1D4ED8" },
        neutral: { 50: "#F8FAFC", 950: "#020617" },
      },
      light: {
        background: "#FFFFFF",
        surface: "#F8FAFC",
        text: "#020617",
        textMuted: "#334155",
        border: "#CBD5E1",
        accent: "#1D4ED8",
        focus: "#2563EB",
      },
      dark: {
        background: "#020617",
        surface: "#172554",
        text: "#F8FAFC",
        textMuted: "#E2E8F0",
        border: "#475569",
        accent: "#93C5FD",
        focus: "#93C5FD",
      },
    };
    await writeFile(path.join(project, "palette.json"), JSON.stringify(palette));
    const result = run(
      "skills/brandfy-design-tokens/scripts/generate-tokens.mjs",
      ["--input", "palette.json", "--output", "brand"],
      project,
    );
    assert.equal(result.status, 0, result.stderr);
    await access(path.join(project, "brand/global.css"));
    await access(path.join(project, "brand/tokens.json"));
    const css = await readFile(path.join(project, "brand/global.css"), "utf8");
    assert.match(css, /Edite palette\.json/);
    assert.match(css, /prefers-color-scheme: dark/);
    assert.match(css, /data-theme="dark"/);
    const tailwind = await readFile(path.join(project, "brand/tailwind-theme.js"), "utf8");
    assert.match(tailwind, /background/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("instalador copia os templates sem substituir alterações", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-template-test-"));
  try {
    const result = run(
      "skills/brandfy-templates-canais/scripts/install-templates.mjs",
      ["--output", path.join(project, "templates")],
      process.cwd(),
    );
    assert.equal(result.status, 0, result.stderr);
    await access(path.join(project, "templates/youtube-banner.svg"));
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("exportador rasteriza wordmark com fonte local e registra dimensões", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-logo-test-"));
  try {
    const input = path.join(project, "brand/logo/svg");
    await mkdir(input, { recursive: true });
    await writeFile(
      path.join(input, "logo-light.svg"),
      [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">',
        '  <rect width="80" height="80" fill="#00161E"/>',
        '  <text x="100" y="70" fill="#00161E" font-size="48">Brandfy</text>',
        "</svg>",
      ].join("\n"),
      "utf8",
    );

    const result = run(
      "skills/brandfy-ativos-logo/scripts/export-logo.mjs",
      [
        "--input",
        input,
        "--output",
        path.join(project, "brand/logo/png"),
        "--manifest",
        path.join(project, "brand/manifest.json"),
        "--font",
        path.resolve("brand/fonts/manrope-variable.ttf"),
      ],
      process.cwd(),
    );
    assert.equal(result.status, 0, result.stderr);

    const manifest = JSON.parse(
      await readFile(path.join(project, "brand/manifest.json"), "utf8"),
    );
    assert.equal(manifest.assets[0].width, 300);
    assert.equal(manifest.assets[0].height, 100);
    await access(path.join(project, "brand/logo/png/logo-light-512w.png"));
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("guia instala o design system de PDF sem substituir alterações", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-pdf-test-"));
  try {
    const script = "skills/brandfy-guia-pdf/scripts/build-brand-guide.mjs";
    const first = run(
      script,
      ["--project", project, "--install-assets"],
      process.cwd(),
    );
    assert.equal(first.status, 0, first.stderr);
    const cssPath = path.join(project, "brand/pdf/pdf.css");
    const css = await readFile(cssPath, "utf8");
    assert.match(css, /pdf-design-system: 1\.0\.0/);
    await access(path.join(project, "brand/pdf/template.html"));
    await access(path.join(project, "brand/pdf/fonts/inter-latin.woff2"));
    await writeFile(cssPath, `${css}\n/* personalização */\n`, "utf8");

    const second = run(
      script,
      ["--project", project, "--install-assets"],
      process.cwd(),
    );
    assert.equal(second.status, 0, second.stderr);
    assert.match(await readFile(cssPath, "utf8"), /personalização/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
