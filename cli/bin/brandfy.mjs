#!/usr/bin/env node

/**
 * Expõe o executável público do Brandfy.
 *
 * O arquivo permanece pequeno para que toda a lógica possa ser importada e
 * exercitada pela suíte sem iniciar outro processo.
 */

import { main } from "../src/cli.mjs";

await main(process.argv.slice(2));
