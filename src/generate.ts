#!/usr/bin/env node

import { parseArgs } from "node:util";
import Rand48 from "./Rand48.ts";
import { SEED_EXTRACTION_PARAMS } from "./constants.ts";
import type { SeedExtractionParameters } from "./types.ts";

/**
 * JAVASCRIPT USAGE:
 * `node dist/generate.js --n 100 --rand48seed 1234 --kind prime`
 * The line below is equivalent to the line above, using shorthand args.
 * `node dist/generate.js -n 100 -s 1234 -k prime`
 *
 * TYPESCRIPT USAGE:
 * `node src/generate.ts --n 100 --rand48seed 1234 --kind binary`
 * The line below is equivalent to the line above, using shorthand args.
 * `node src/generate.ts -n 100 -s 1234 -k binary`
 */

type Arguments = {
  n: string;
  rand48seed: string;
  kind: string;
  help?: boolean;
};

type ParsedArgs = {
  positionals: any[];
  values: Arguments;
};

const { values } = parseArgs({
  options: {
    n: { type: "string", short: "n" },
    rand48seed: { type: "string", short: "s" },
    kind: { type: "string", short: "k" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
  allowPositionals: false,
}) as ParsedArgs;

if (values.help) {
  printHelp();
  process.exit(0);
}

if (!values.n || !/^[1-9]\d*$/.test(values.n)) {
  throw new Error("--n must be a positive integer");
}
if (!values.rand48seed || !/^\d+$/.test(values.rand48seed)) {
  throw new Error(
    "'--rand48seed', or '-s', must be a nonnegative decimal integer",
  );
}
if (!values.kind || (values.kind !== "prime" && values.kind !== "binary")) {
  throw new Error("'--kind', or '-k', must be either 'prime' or 'binary'");
}

const n = Number(values.n);
if (!Number.isSafeInteger(n)) {
  throw new Error("--n exceeds the maximum safe integer");
}

const params = SEED_EXTRACTION_PARAMS[values.kind];
const seeds = generateNSeeds(n, BigInt(values.rand48seed), params);

for (const seed of seeds) {
  console.log(seed.toString(16).toUpperCase());
}

// Generates N amount of "NIST-style" seeds, using `rand48Seed` for entropy.
// Returns `bigint` seeds, hex encoded.
// Use `<returnValue>.toStriing(16)` if you want a hex encoded string.
export default function generateNSeeds(
  n: number,
  rand48Seed: bigint,
  extractionParams: SeedExtractionParameters,
): bigint[] {
  const seeds: bigint[] = new Array(n).fill(0n);
  const rng = new Rand48(rand48Seed);

  for (let i = 0; i < n; i++) {
    let seed = "";

    for (let j = 0; j < extractionParams.lrand48Iterations; j++) {
      const byte = rng.lrand48() >>> extractionParams.shiftOutputBy;
      seed += byte
        .toString(16)
        .padStart(extractionParams.width, "0")
        .toUpperCase();
    }

    seeds[i] = BigInt(`0x${seed}`);
  }

  return seeds;
}

function printHelp(): void {
  const helpMessage = `
Usage (TypeScript source, Node v22.18.0 or later): 
  node src/generate.ts [options]
Usage (JavaScript, after compiling):
  npm run build
  node dist/generate.js [options]

Options:
  -n, --n <count>               Number of seeds to generate.
  -s, --rand48Seed <seed>       Initial seed for rand48.
  -k, --kind <prime|binary>     Seed extraction method.
                                Must be either 'prime' or 'binary'
  -h, --help                    Display this help message

Examples (TypeScript):
  node src/generate.ts --n 100 --rand48seed 1234 --kind binary
  node src/generate.ts -n 100 -s 1234 -k binary
  node src/generate.ts -h
  node src/generate.ts --help

Examples (JavaScript):
  npm run build # Project must be compiled first!
  node dist/generate.js --n 100 --rand48seed 1234 --kind prime
  node dist/generate.js -n 100 -s 1234 -k binary
  node dist/generate.js -h
  node dist/generate.js --help
`.trim();

  console.log(helpMessage);
}
