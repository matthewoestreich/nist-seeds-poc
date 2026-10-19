import streams from "./streams.ts";
import Rand48 from "./rand48.ts";

import type { Stream, StreamResult } from "./types.ts";

searchPrimeStreams(streams);

const results: StreamResult[] = streams.map((stream) => {
  stream.unixTimestamp = dateToUnixTimestamp(stream.date);
  const value = reconstructSeed(stream);

  return {
    name: stream.name,
    kind: stream.kind,
    date: stream.date,
    unixTimestamp: stream.unixTimestamp,
    published: stream.published,
    value,
    isAccurate: value === stream.published,
  };
});

console.log();
console.table(results);
console.log();

function reconstructSeed(stream: Stream): string {
  const isPrime = stream.kind === "PRIME";
  const unixTime = stream.unixTimestamp ?? dateToUnixTimestamp(stream.date);
  const seed = isPrime ? unixTime : Math.floor(unixTime / 2);

  const prng = new Rand48();
  prng.srand48(BigInt(seed));

  const hexs: string[] = [];

  for (let i = 1; i <= stream.overallIterations; i++) {
    for (let j = 0; j < stream.prngIterations; j++) {
      const random = prng.lrand48();
      if (i === stream.overallIterations) {
        const keep = random >>> stream.shiftOutputBy;
        const hex = keep.toString(16).padStart(stream.width, "0").toUpperCase();
        hexs.push(hex);
      }
    }
  }

  return hexs.join("");
}

function generatePrimeSeeds(rand48Seed: bigint, iterations: number): string[] {
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

function nextSeedBytes(rng: Rand48, size: number, shiftBy: number): Uint8Array {
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = rng.lrand48() >> shiftBy;
  }
  return bytes;
}

function searchPrimeStreams(streams: Stream[]): void {
  const primes = streams.filter((stream) => stream.kind === "PRIME");
  const groupedPrimes = Object.groupBy(primes, (p) =>
    dateToUnixTimestamp(p.date),
  );

  for (const [timestamp, streams] of Object.entries(groupedPrimes)) {
    if (!streams || !streams.length) {
      continue;
    }

    const date = dateFromUnixTimestamp(Number(timestamp));
    console.log(`srand48(${timestamp}) [${formatDate(date)}]`);

    const prng = new Rand48();
    prng.srand48(BigInt(timestamp));

    for (let n = 1, seen = 0; seen < streams.length; n++) {
      const seedBytes = nextSeedBytes(prng, 20, 23);
      const seed = Buffer.from(seedBytes).toString("hex").toUpperCase();

      const existing = streams.find((s) => s.published === seed);
      if (existing) {
        seen++;
        console.log(`  found : ${existing.name} | ${seed}`);
      }
    }
  }
}

function dateFromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

function dateToUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function formatDate(date: Date): string {
  return date
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d{3}Z$/, " +0000 UTC");
}
