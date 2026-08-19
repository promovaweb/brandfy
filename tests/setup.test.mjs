/**
 * Exercita a instalação idempotente do Brandfy em um projeto temporário.
 */

import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const setup = path.resolve("skills/brandfy-setup/scripts/setup.mjs");

function run(args) {
  return spawnSync(process.execPath, [setup, ...args], { encoding: "utf8" });
}

test("setup cria a estrutura e preserva instruções existentes", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-setup-test-"));
  try {
    await writeFile(
      path.join(project, "AGENTS.md"),
      "# Projeto\n\nInstrução preservada.\n",
      "utf8",
    );
    assert.equal(run(["--project", project]).status, 0);
    assert.equal(run(["--project", project, "--check"]).status, 0);

    const first = await readFile(path.join(project, "AGENTS.md"), "utf8");
    assert.match(first, /Instrução preservada/);
    assert.match(first, /\$brandfy/);
    assert.match(first, /\$brandfy-mvp/);
    assert.equal((first.match(/brandfy:consumer:start/g) ?? []).length, 1);

    const config = await readFile(
      path.join(project, ".brandfy/config.yaml"),
      "utf8",
    );
    assert.match(config, /interview_source: \.brandfy\/interview\.json/);
    assert.match(config, /brand_document: BRAND\.md/);
    assert.match(config, /mvp_source: MVP\.md/);
    assert.match(await readFile(path.join(project, "BRAND.md"), "utf8"), /# BRAND\.md/);
    assert.match(await readFile(path.join(project, "brand/README.md"), "utf8"), /Índice dos arquivos/);
    await access(path.join(project, ".brandfy/interviews"));
    await access(path.join(project, "brand/pdf/pdf.css"));
    await access(path.join(project, "brand/pdf/template.html"));
    await access(path.join(project, "brand/pdf/fonts/inter-latin.woff2"));

    assert.equal(run(["--project", project]).status, 0);
    const second = await readFile(path.join(project, "AGENTS.md"), "utf8");
    assert.equal(second, first);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("setup migra o manual antigo para BRAND.md e deixa o README como índice", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-setup-migrate-"));
  try {
    await mkdir(path.join(project, "brand"), { recursive: true });
    await writeFile(
      path.join(project, "brand/README.md"),
      "# Manual antigo\n\n## Conceito visual\n\nConteúdo aprovado.\n",
      "utf8",
    );
    assert.equal(run(["--project", project]).status, 0);
    assert.match(await readFile(path.join(project, "BRAND.md"), "utf8"), /Conteúdo aprovado/);
    assert.match(await readFile(path.join(project, "brand/README.md"), "utf8"), /Índice dos arquivos/);
    assert.equal(run(["--project", project, "--check"]).status, 0);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
