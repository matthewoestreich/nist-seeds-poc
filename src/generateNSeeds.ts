import type { SeedExtractionParameters } from "./types.ts";

import Rand48 from "./Rand48.ts";

export default function generateNSeeds(
  n: number,
  rand48Seed: bigint,
  extractionParams: SeedExtractionParameters,
): string[] {
  const seeds: string[] = new Array<string>(n).fill("");
  const rng = new Rand48();
  rng.srand48(rand48Seed);

  for (let i = 0; i < n; i++) {
    const seed: string[] = new Array<string>(n).fill("");

    for (let j = 0; j < extractionParams.lrand48Iterations; j++) {
      const byte = rng.lrand48() >>> extractionParams.shiftOutputBy;
      seed[j] = byte
        .toString(16)
        .padStart(extractionParams.width, "0")
        .toUpperCase();
    }

    seeds[i] = seed.join("");
  }

  return seeds;
}
