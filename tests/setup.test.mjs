/**
 * Exercita a instalação idempotente do Brandfy em um projeto temporário.
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
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
    assert.equal((first.match(/brandfy:consumer:start/g) ?? []).length, 1);

    assert.equal(run(["--project", project]).status, 0);
    const second = await readFile(path.join(project, "AGENTS.md"), "utf8");
    assert.equal(second, first);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
