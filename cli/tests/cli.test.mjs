/**
 * Exercita o contrato público do CLI sem acessar rede nem instalar skills.
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execute } from "../src/cli.mjs";

function fakeRunner(calls) {
  return {
    async runSkills(args, cwd) {
      calls.push({ type: "skills", args, cwd });
      return { code: 0, stdout: "", stderr: "" };
    },
    async runScript(script, args, cwd) {
      calls.push({ type: "script", script, args, cwd });
      return { code: 0, stdout: "", stderr: "" };
    },
  };
}

test("mostra ajuda e versão sem iniciar processos", async () => {
  const output = [];
  assert.equal(await execute([], { stdout: (line) => output.push(line) }), 0);
  assert.match(output.join("\n"), /brandfy init/);

  output.length = 0;
  assert.equal(
    await execute(["--version"], { stdout: (line) => output.push(line) }),
    0,
  );
  assert.match(output[0], /^\d+\.\d+\.\d+$/);
});

test("instala as skills pelo gerenciador oficial", async () => {
  const calls = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-install-"));
  const code = await execute(
    [
      "skills",
      "install",
      project,
      "--source",
      "./brandfy-local",
      "--agent",
      "codex",
    ],
    { runner: fakeRunner(calls), cwd: project },
  );

  assert.equal(code, 0);
  assert.deepEqual(calls[0], {
    type: "skills",
    args: [
      "add",
      "./brandfy-local",
      "--agent",
      "codex",
      "--skill",
      "*",
      "-y",
      "--copy",
    ],
    cwd: project,
  });
});

test("executa o setup instalado depois do init", async () => {
  const calls = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-init-"));
  const script = path.join(
    project,
    ".agents",
    "skills",
    "brandfy-setup",
    "scripts",
    "setup.mjs",
  );
  await mkdir(path.dirname(script), { recursive: true });
  await writeFile(script, "", "utf8");

  assert.equal(
    await execute(["init", project], {
      runner: fakeRunner(calls),
      cwd: project,
      stdout: () => {},
    }),
    0,
  );
  assert.equal(calls.length, 2);
  assert.equal(calls[1].type, "script");
  assert.equal(calls[1].script, script);
  assert.deepEqual(calls[1].args, ["--project", project]);
});

test("encaminha argumentos adicionais ao gerador de PDF", async () => {
  const calls = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-pdf-"));
  const script = path.join(
    project,
    ".agents",
    "skills",
    "brandfy-guia-pdf",
    "scripts",
    "build-brand-guide.mjs",
  );
  await mkdir(path.dirname(script), { recursive: true });
  await writeFile(script, "", "utf8");

  assert.equal(
    await execute(
      ["pdf", project, "--", "--output", "brand/manual.pdf"],
      { runner: fakeRunner(calls), cwd: project },
    ),
    0,
  );
  assert.deepEqual(calls[0].args, [
    "--project",
    project,
    "--output",
    "brand/manual.pdf",
  ]);
});

test("doctor retorna falha em projeto ainda não preparado", async () => {
  const output = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-doctor-"));
  const code = await execute(["doctor", project, "--json"], {
    cwd: project,
    stdout: (line) => output.push(line),
  });
  const report = JSON.parse(output.join("\n"));

  assert.equal(code, 1);
  assert.equal(report.project, project);
  assert.equal(report.checks.some((check) => check.ok === false), true);
});
