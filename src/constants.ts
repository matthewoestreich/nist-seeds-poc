import type { SeedExtractionParameters } from "./types.ts";

export const SEED_BITS = 160n;
export const SEED_BYTES = 20;
export const SEED_MODULUS = 1n << SEED_BITS;

export const SEED_EXTRACTION_PARAMS: Record<
  "prime" | "binary",
  SeedExtractionParameters
> = {
  prime: { shiftOutputBy: 23, width: 2, lrand48Iterations: 20 },
  binary: { shiftOutputBy: 0, width: 8, lrand48Iterations: 5 },
};
