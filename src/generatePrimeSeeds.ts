import Rand48 from "./rand48.ts";

export default function generatePrimeSeeds(
  rand48Seed: bigint,
  iterations: number,
): string[] {
  const PRIME_ITERATIONS = 20;
  const PRIME_OUTPUT_SHIFT_BY = 23;
  const PRIME_WIDTH = 2;

  const seeds: string[] = new Array<string>(iterations).fill("");
  const rng = new Rand48();
  rng.srand48(rand48Seed);

  for (let i = 0; i < iterations; i++) {
    const seed: string[] = new Array<string>(PRIME_ITERATIONS).fill("");

    for (let j = 0; j < PRIME_ITERATIONS; j++) {
      const byte = rng.lrand48() >>> PRIME_OUTPUT_SHIFT_BY;
      seed[j] = byte.toString(16).padStart(PRIME_WIDTH, "0").toUpperCase();
    }

    seeds[i] = seed.join("");
  }

  return seeds;
}
