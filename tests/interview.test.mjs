/**
 * Exercita a entrevista estruturada e a compilação idempotente dos arquivos.
 */

import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const compiler = path.resolve(
  "skills/brandfy-entrevista/scripts/compile-interview.mjs",
);

/**
 * Executa o compilador no projeto temporário.
 *
 * @param {string} project Raiz do projeto.
 * @param {string[]} args Argumentos adicionais.
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(project, args = []) {
  return spawnSync(process.execPath, [compiler, "--project", project, ...args], {
    encoding: "utf8",
  });
}

test("entrevista valida cobertura e compila sem apagar texto autoral", async () => {
  const project = await mkdtemp(path.join(os.tmpdir(), "brandfy-interview-test-"));
  try {
    assert.equal(run(project, ["--init"]).status, 0);
    const input = path.join(project, ".brandfy/interview.json");
    const draft = JSON.parse(await readFile(input, "utf8"));
    assert.notEqual(run(project, ["--check"]).status, 0);

    const ready = {
      ...draft,
      status: "ready",
      interview: {
        ...draft.interview,
        date: "2026-07-30",
        participants: ["Fundadora"],
        purpose: "Definir a base da marca",
        consentObtained: true,
        confirmedBy: "Fundadora",
        confirmedAt: "2026-07-30",
      },
      progress: {
        currentStage: "complete",
        completedStages: [
          "business",
          "audiences",
          "positioning",
          "personality",
          "voice",
          "visual",
          "assets-rights",
          "operations-governance",
        ],
        stageConfirmations: [
          "business",
          "audiences",
          "positioning",
          "personality",
          "voice",
          "visual",
          "assets-rights",
          "operations-governance",
        ].map((stage) => ({
          stage,
          confirmedBy: "Fundadora",
          confirmedAt: "2026-07-30",
          notes: "Síntese conferida.",
        })),
      },
      brand: {
        ...draft.brand,
        name: "Marca Teste",
        nameStatus: "approved",
        category: "Consultoria",
        offer: "Projetos de estratégia",
        geography: ["Brasil"],
      },
      business: {
        ...draft.business,
        problem: "Equipes trabalham sem parâmetros comuns.",
        solution: "Facilitação e documentação da estratégia.",
        goals: ["Reduzir retrabalho"],
      },
      audiences: [
        {
          name: "Lideranças",
          context: "Precisam alinhar decisões entre áreas.",
          needs: ["Parâmetros claros"],
          objections: ["Tempo de implantação"],
          desiredOutcome: "Equipe alinhada",
        },
      ],
      positioning: {
        ...draft.positioning,
        alternatives: ["Consultoria tradicional", "Trabalho interno"],
        promise: "Transformar estratégia em parâmetros utilizáveis.",
        difference: "Une facilitação e implementação.",
        reasonsToBelieve: ["Método aplicado em projetos reais"],
      },
      personality: {
        ...draft.personality,
        traits: ["Clara", "Atenta"],
        antiTraits: ["Simplista", "Distante"],
      },
      voice: {
        ...draft.voice,
        principles: ["Explicar o motivo", "Usar exemplos concretos"],
      },
      visual: {
        ...draft.visual,
        desiredImpression: ["Clareza", "Precisão"],
        channels: ["Website", "LinkedIn"],
      },
      operations: {
        ...draft.operations,
        priorityApplications: ["Website", "Proposta"],
        decisionMaker: "Fundadora",
      },
      facts: [
        {
          claim: "A oferta atual combina facilitação e documentação.",
          source: "Entrevista com a fundadora",
        },
      ],
      interpretations: [
        {
          claim: "Clareza operacional pode embasar o posicionamento.",
          basedOn: "Oferta e problema relatados",
        },
      ],
      hypotheses: [
        {
          claim: "Lideranças valorizam parâmetros reutilizáveis.",
          test: "Entrevistar três clientes",
          owner: "Fundadora",
        },
      ],
      preferences: [
        {
          topic: "Direção visual",
          preference: "Evitar excesso de ornamentos",
          rationale: "Facilitar leitura em documentos",
        },
      ],
      evidence: [
        {
          claim: "O método foi aplicado em projetos reais.",
          source: "Portfólio interno",
          status: "disponível",
        },
      ],
    };
    const emptyAlternative = {
      ...ready,
      positioning: {
        ...ready.positioning,
        alternatives: [""],
      },
    };
    await writeFile(
      input,
      `${JSON.stringify(emptyAlternative, null, 2)}\n`,
      "utf8",
    );
    assert.notEqual(run(project, ["--check"]).status, 0);

    await writeFile(input, `${JSON.stringify(ready, null, 2)}\n`, "utf8");
    await writeFile(
      path.join(project, ".brandfy/brief.md"),
      "# Briefing\n\nTexto autoral preservado.\n",
      "utf8",
    );

    assert.equal(run(project, ["--check"]).status, 0);
    assert.equal(run(project).status, 0);
    assert.equal(run(project).status, 0);

    const brief = await readFile(path.join(project, ".brandfy/brief.md"), "utf8");
    assert.match(brief, /Texto autoral preservado/);
    assert.match(brief, /Marca Teste/);
    assert.equal((brief.match(/brandfy:interview:start/g) ?? []).length, 1);

    const strategy = await readFile(path.join(project, "brand/strategy.md"), "utf8");
    assert.match(strategy, /Transformar estratégia em parâmetros utilizáveis/);
    const voice = await readFile(path.join(project, "brand/voice.md"), "utf8");
    assert.match(voice, /Explicar o motivo/);
    const legal = await readFile(path.join(project, "brand/legal.md"), "utf8");
    assert.match(legal, /Portfólio interno/);
    const summary = await readFile(
      path.join(project, ".brandfy/interview-summary.md"),
      "utf8",
    );
    assert.match(summary, /Próximas validações/);
    assert.match(summary, /Clareza operacional pode embasar/);
    assert.match(summary, /Lideranças valorizam parâmetros/);
    assert.match(summary, /Evitar excesso de ornamentos/);
    assert.equal(
      (summary.match(/Síntese conferida/g) ?? []).length,
      8,
    );
  } finally {
    await rm(project, { recursive: true, force: true });
  }
});
