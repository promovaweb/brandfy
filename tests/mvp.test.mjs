/**
 * Exercita a leitura do documento gerado pelo MVPFy e a preparação da marca.
 */

import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const importer = path.resolve("skills/brandfy-mvp/scripts/import-mvp.mjs");
const interviewCompiler = path.resolve("skills/brandfy-entrevista/scripts/compile-interview.mjs");
const sectionIds = [
  "account-model",
  "ai",
  "audience",
  "brand",
  "buying-roles",
  "commercial",
  "company-context",
  "confirmed-choices",
  "economics",
  "execution",
  "executive-summary",
  "hypotheses-and-gaps",
  "infrastructure",
  "main-journey",
  "manual-processes",
  "market",
  "marketing",
  "metrics",
  "modules",
  "onboarding",
  "out-of-mvp",
  "permissions",
  "personas",
  "problem",
  "proof-and-hypotheses",
  "saas-business",
  "sales",
  "scope",
  "sources",
  "subscription",
  "support-retention",
  "technology",
  "threats-and-validation",
  "value-and-positioning",
  "website",
];
const fixtureContent = {
  "executive-summary": "Produto: SyncaLeads, uma plataforma SaaS B2B para eventos online. O MVP valida a jornada de inscrição e acesso.",
  problem: "**Status:** Confirmado como direção\n\nOrganizadores precisam reunir página, cadastro, acesso e lembrete em uma jornada.",
  audience: "Produtores e organizadores de webinars, aulas e lives formam o segmento prioritário.",
  personas: "| Persona | Papel | Contexto | Necessidade | Objeção | Canal |\n| --- | --- | --- | --- | --- | --- |\n| Organizador | Usuário | Publica eventos | Capturar inscritos | Operação fragmentada | Comunidades, Instagram e email |",
  "value-and-positioning": "**Promessa central:** Publique seu evento, capture os inscritos e entregue acesso em uma única jornada.\n\n**Posicionamento:** Ferramenta simples para organizadores de eventos online.",
  brand: "**Nome provisório:** SyncaLeads.\n\nCategoria: plataforma de inscrições para eventos online. Personalidade: simples, confiável e operacional. Slogan sugerido: Inscreva e acompanhe.",
  website: "Landing page pública, painel do produto e páginas de evento mobile-first.",
  marketing: "Canal confirmado: comunidades, Instagram, YouTube e WhatsApp. Conteúdo e divulgação semanal.",
  "confirmed-choices": "| Data | Área | Escolha | Origem |\n| --- | --- | --- | --- |\n| 2026-08-18 | Produto | Jornada completa de evento e acesso | Usuário |",
  "hypotheses-and-gaps": "| Item | Tipo | Impacto | Próxima pergunta ou teste |\n| --- | --- | --- | --- |\n| Disposição a pagar | Hipótese | Alto | Testar com usuários |",
};
const source = `---\ndocument_type: mvpfy_mvp_plan\nschema_version: 1.0.0\nproject_id: test-project\nproject_name: SyncaLeads\ndocument_status: ready\ninterview_status: finalization\ncreated_at: 2026-08-18T00:00:00.000Z\nupdated_at: 2026-08-18T01:00:00.000Z\nlanguage: pt-BR\n---\n\n# MVP.md\n\n${sectionIds.map((id, index) => `<!-- mvpfy:section:${id} -->\n## ${index + 1}. ${id}\n\n${fixtureContent[id] || `Contexto registrado para ${id}.`}`).join("\n\n")}\n`;

function run(project, args = []) {
  return spawnSync(process.execPath, [importer, "--project", project, ...args], {
    encoding: "utf8",
  });
}

test("importa MVP.md, deriva a base da marca e lista lacunas", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-mvp-test-"));
  try {
    await writeFile(path.join(project, "MVP.md"), source, "utf8");
    const checked = run(project, ["--check"]);
    assert.equal(checked.status, 0, checked.stderr);

    const result = run(project);
    assert.equal(result.status, 0, result.stderr);

    const brand = await readFile(path.join(project, "BRAND.md"), "utf8");
    assert.match(brand, /Promessa central/);
    assert.match(brand, /Mapa de arquivos da marca/);
    assert.match(brand, /positioning\.reasonsToBelieve/);
    assert.match(brand, /brand\/logo\/svg/);

    const context = JSON.parse(
      await readFile(path.join(project, ".brandfy/mvp-context.json"), "utf8"),
    );
    assert.equal(context.source.documentType, "mvpfy_mvp_plan");
    assert.equal(context.sections.length, 35);
    assert.equal(context.sourceClaims.product.length > 0, true);
    assert.equal(context.sourceClaims.operations.length > 0, true);
    assert.equal(context.sourceClaims.validation.length > 0, true);
    assert.equal(context.brand.name, "SyncaLeads");
    assert.equal(context.interview.status, "imported");
    assert.equal(context.interview.positioning.promise.length > 0, true);
    assert.equal(context.gaps.length > 0, true);
    const interview = JSON.parse(
      await readFile(path.join(project, ".brandfy/interview.json"), "utf8"),
    );
    assert.equal(interview.schemaVersion, 1);
    assert.equal(interview.brand.name, "SyncaLeads");
    assert.equal(interview.visual.channels.length > 0, true);
    const compiledCheck = spawnSync(
      process.execPath,
      [interviewCompiler, "--project", project, "--check"],
      { encoding: "utf8" },
    );
    assert.equal(compiledCheck.status, 0, compiledCheck.stderr);
    const compiled = spawnSync(
      process.execPath,
      [interviewCompiler, "--project", project],
      { encoding: "utf8" },
    );
    assert.equal(compiled.status, 0, compiled.stderr);
    assert.match(
      await readFile(path.join(project, ".brandfy/interview-summary.md"), "utf8"),
      /origem MVPFy/i,
    );

    const index = await readFile(path.join(project, "brand/README.md"), "utf8");
    assert.match(index, /BRAND\.md/);
    assert.doesNotMatch(index, /# Manual da marca/);

    await writeFile(
      path.join(project, "BRAND.md"),
      `${brand}\n## Nota humana\n\nPreservar esta anotação.\n`,
      "utf8",
    );
    const repeated = run(project);
    assert.equal(repeated.status, 0, repeated.stderr);
    const repeatedBrand = await readFile(path.join(project, "BRAND.md"), "utf8");
    assert.match(repeatedBrand, /Preservar esta anotação/);
    assert.equal((repeatedBrand.match(/brandfy:mvpfy:start/g) || []).length, 1);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("brandfy orquestra o MVP diretamente e não depende do CLI", async () => {
  const brandfy = await readFile("skills/brandfy/SKILL.md", "utf8");
  assert.match(brandfy, /Procurar `MVP\.md` somente na raiz/);
  assert.match(brandfy, /chamar `\$brandfy-mvp`/);
  assert.match(brandfy, /única porta de entrada conversacional/);
  assert.doesNotMatch(brandfy, /brandfy mvp import/);
});

test("importador reprova MVP sem uma seção canônica", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-mvp-invalid-"));
  try {
    const sourceText = source;
    await writeFile(
      path.join(project, "MVP.md"),
      sourceText.replace("<!-- mvpfy:section:technology -->", ""),
      "utf8",
    );
    const result = run(project, ["--check"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /technology/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});

test("importador transforma um README legado em índice sem perder o manual", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-mvp-legacy-"));
  try {
    await mkdir(path.join(project, "brand"), { recursive: true });
    await writeFile(
      path.join(project, "brand/README.md"),
      "# Manual da marca\n\n## Conceito visual\n\nConteúdo aprovado.\n",
      "utf8",
    );
    await writeFile(path.join(project, "MVP.md"), source, "utf8");

    const result = run(project);
    assert.equal(result.status, 0, result.stderr);
    assert.match(await readFile(path.join(project, "BRAND.md"), "utf8"), /Conteúdo aprovado/);
    assert.match(await readFile(path.join(project, "brand/README.md"), "utf8"), /Índice dos arquivos/);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
