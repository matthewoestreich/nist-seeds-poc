import type { PublishedSeed, StreamResult } from "./types.ts";
import { SEED_EXTRACTION_PARAMS } from "./constants.ts";
import streams from "./streams.ts";
import Rand48 from "./Rand48.ts";

const results: StreamResult[] = [];

for (const stream of streams) {
  for (const published of stream.published) {
    const calculatedSeed = reconstructSeed(
      stream.timestamp,
      stream.primeField,
      published,
    ).toUpperCase();

    const publishedSeed = published.seed.toString(16).toUpperCase();

    results.push({
      name: published.name,
      date: stream.date,
      timestamp: stream.timestamp,
      publishedSeed,
      calculatedSeed,
      isAccurate: publishedSeed === calculatedSeed,
    });
  }
}

console.log();
console.table(results);
console.log();

function reconstructSeed(
  timestamp: number,
  primeField: bigint | undefined,
  publishedSeed: PublishedSeed,
): string {
  const isPrime = primeField !== undefined;
  const { params, seed } = isPrime
    ? { seed: timestamp, params: SEED_EXTRACTION_PARAMS.prime }
    : {
        seed: Math.floor(timestamp / 2),
        params: SEED_EXTRACTION_PARAMS.binary,
      };

  const prng = new Rand48();
  prng.srand48(BigInt(seed));

  const hexs: string[] = [];

  for (let i = 1; i <= publishedSeed.candidateNumber; i++) {
    for (let j = 0; j < params.lrand48Iterations; j++) {
      const random = prng.lrand48();
      if (i === publishedSeed.candidateNumber) {
        const keep = random >>> params.shiftOutputBy;
        const hex = keep.toString(16).padStart(params.width, "0").toUpperCase();
        hexs.push(hex);
      }
    }
  }

  return hexs.join("");
}
