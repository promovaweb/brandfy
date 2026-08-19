/**
 * Exercita os três comandos públicos do CLI sem acessar rede nem instalar skills.
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execute } from "../src/cli.mjs";
import { REQUIRED_SKILLS } from "../src/project.mjs";

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

async function createInstalledProject(project) {
  for (const skill of REQUIRED_SKILLS) {
    await mkdir(path.join(project, ".agents", "skills", skill), { recursive: true });
    await writeFile(
      path.join(project, ".agents", "skills", skill, "SKILL.md"),
      `# ${skill}\n`,
      "utf8",
    );
  }
  await mkdir(path.join(project, ".brandfy"), { recursive: true });
  await mkdir(path.join(project, "brand"), { recursive: true });
  await writeFile(path.join(project, "skills-lock.json"), "{}\n", "utf8");
  await writeFile(path.join(project, ".brandfy/config.yaml"), "version: 1\n", "utf8");
  await writeFile(path.join(project, "BRAND.md"), "# BRAND.md\n", "utf8");
  await writeFile(path.join(project, "brand/README.md"), "# Índice\n", "utf8");
  await writeFile(
    path.join(project, "AGENTS.md"),
    "<!-- brandfy:consumer:start -->\n<!-- brandfy:consumer:end -->\n",
    "utf8",
  );
}

test("mostra somente a interface pública simplificada", async () => {
  const output = [];
  assert.equal(await execute([], { stdout: (line) => output.push(line) }), 0);
  const help = output.join("\n");
  assert.match(help, /brandfy install/);
  assert.match(help, /brandfy update/);
  assert.match(help, /brandfy doctor/);
  assert.doesNotMatch(help, /brandfy init/);
  assert.doesNotMatch(help, /brandfy pdf/);
  assert.doesNotMatch(help, /brandfy mvp/);
});

test("instala as skills e executa o setup", async () => {
  const calls = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-install-"));
  try {
    const setup = path.join(
      project,
      ".agents",
      "skills",
      "brandfy-setup",
      "scripts",
      "setup.mjs",
    );
    await mkdir(path.dirname(setup), { recursive: true });
    await writeFile(setup, "", "utf8");

    assert.equal(
      await execute(["install", "."], {
        runner: fakeRunner(calls),
        cwd: project,
        stdout: () => {},
      }),
      0,
    );
    assert.equal(calls[0].type, "skills");
    assert.deepEqual(calls[0].args, [
      "add",
      "promovaweb/brandfy",
      "--agent",
      "codex",
      "--skill",
      "*",
      "-y",
      "--copy",
    ]);
    assert.deepEqual(calls[1].args, ["--project", project]);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("atualiza e verifica o projeto sem expor especialistas", async () => {
  const calls = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-update-"));
  try {
    const setup = path.join(
      project,
      ".agents",
      "skills",
      "brandfy-setup",
      "scripts",
      "setup.mjs",
    );
    await mkdir(path.dirname(setup), { recursive: true });
    await writeFile(setup, "", "utf8");
    assert.equal(
      await execute(["update"], {
        runner: fakeRunner(calls),
        cwd: project,
        stdout: () => {},
      }),
      0,
    );
    assert.equal(calls.filter(({ type }) => type === "skills").length, 1);
    assert.deepEqual(calls.slice(1).map(({ args }) => args), [
      ["--project", project],
      ["--project", project, "--check"],
    ]);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("doctor reconhece todas as skills e os arquivos do projeto", async () => {
  const output = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-doctor-"));
  try {
    await createInstalledProject(project);
    const code = await execute(["doctor", "--json"], {
      cwd: project,
      stdout: (line) => output.push(line),
    });
    const report = JSON.parse(output.join("\n"));
    assert.equal(code, 0);
    assert.equal(report.checks.find((check) => check.name === "Biblioteca do Brandfy").ok, true);
    assert.equal(report.checks.find((check) => check.name === "Guia da marca").ok, true);
    assert.equal(report.checks.find((check) => check.name === "Índice da marca").ok, true);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("doctor reprova projeto sem a biblioteca", async () => {
  const output = [];
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-cli-doctor-empty-"));
  try {
    const code = await execute(["doctor"], {
      cwd: project,
      stdout: (line) => output.push(line),
    });
    assert.equal(code, 1);
    assert.match(output.join("\n"), /Biblioteca do Brandfy/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("recusa comandos antigos e opções complexas", async () => {
  await assert.rejects(
    execute(["init"], { stdout: () => {} }),
    /Comando desconhecido/,
  );
  await assert.rejects(
    execute(["pdf"], { stdout: () => {} }),
    /Comando desconhecido/,
  );
  await assert.rejects(
    execute(["install", "--source", "local"], { stdout: () => {} }),
    /Opção desconhecida/,
  );
});
