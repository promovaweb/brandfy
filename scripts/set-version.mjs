/**
 * Atualiza a SemVer única da release do Brandfy.
 *
 * A versão do framework, do CLI npm, do lock do CLI e da documentação
 * portátil precisa avançar em conjunto. O script recusa versões inválidas e
 * não modifica outras propriedades dos manifestos.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(version)) {
  throw new Error(
    "Informe uma versão SemVer, por exemplo: npm run version:set -- 1.2.0",
  );
}

async function updateManifest(relativePath, updateRootPackage = false) {
  const target = path.join(root, relativePath);
  const manifest = JSON.parse(await readFile(target, "utf8"));
  manifest.version = version;
  if (updateRootPackage && manifest.packages?.[""]) {
    manifest.packages[""].version = version;
  }
  await writeFile(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

await Promise.all([
  updateManifest("package.json"),
  updateManifest("cli/package.json"),
  updateManifest("cli/package-lock.json", true),
  writeFile(path.join(root, "ebooks", "VERSION"), `${version}\n`, "utf8"),
]);

console.log(`Versão ${version} aplicada ao framework, CLI e documentação.`);
