/**
 * Confere que o ebook portátil do Brandfy publica somente o guia do usuário.
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ebook usa somente docs/user e o nome do guia do usuário", async () => {
  const build = await readFile(".ebook/build-ebook.sh", "utf8");
  const order = await readFile("docs/user/reading-order.txt", "utf8");
  const manifest = JSON.parse(await readFile("ebooks/build.json", "utf8"));
  const version = (await readFile("ebooks/VERSION", "utf8")).trim();

  assert.match(build, /DOCS_ROOT="\$ROOT\/docs\/user"/);
  assert.match(build, /STEM="Brandfy-Guia-do-Usuario-v\$VERSION"/);
  assert.match(build, /docs\/user\/reading-order\.txt/);
  assert.doesNotMatch(build, /Brandfy-Documentacao-Completa/);
  assert.doesNotMatch(build, /Guia do usuário e referência técnica/);

  const orderedPages = order
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  assert.ok(orderedPages.length > 0);
  assert.ok(orderedPages.every((page) => page.startsWith("docs/user/")));
  assert.ok(
    manifest.sources
      .filter((source) => source.startsWith("docs/"))
      .every((source) => source.startsWith("docs/user/")),
  );
  assert.equal(
    manifest.artifacts.pdf.file,
    `Brandfy-Guia-do-Usuario-v${version}.pdf`,
  );
  assert.equal(
    manifest.artifacts.epub.file,
    `Brandfy-Guia-do-Usuario-v${version}.epub`,
  );
});
