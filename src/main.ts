import streams from "./streams.ts";
import Rand48 from "./rand48.ts";
import { qualifiesSeed } from "./qualifies.ts";
import {
  dateFromUnixTimestamp,
  dateToUnixTimestamp,
  formatDate,
} from "./date.ts";

import type { AcceptedSeed, Stream } from "./types.ts";

const candidates = await searchPrimeStreams(streams);
console.log({ candidates });

// @ts-ignore
function nextSeedBytes(rng: Rand48, size: number, shiftBy: number): Uint8Array {
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = rng.lrand48() >>> shiftBy;
  }
  return bytes;
}

function calculateNextPrimeSeed(rng: Rand48): string {
  let out = "";
  for (let i = 0; i < 20; i++) {
    const byte = rng.lrand48() >>> 23;
    out += byte.toString(16).padStart(2, "0");
  }
  return out;
}

async function searchPrimeStreams(streams: Stream[]): Promise<AcceptedSeed[]> {
  const primes = streams.filter((stream) => stream.kind === "PRIME");
  const groupedPrimes = Object.groupBy(primes, (p) =>
    dateToUnixTimestamp(p.date),
  );

  const accepted: AcceptedSeed[] = [];

  for (const [timestamp, streams] of Object.entries(groupedPrimes)) {
    if (!streams || !streams.length) {
      continue;
    }

    const date = dateFromUnixTimestamp(Number(timestamp));
    console.log(`srand48(${timestamp}) [${formatDate(date)}]`);

    const prng = new Rand48();
    prng.srand48(BigInt(timestamp));

    // `prime` field will be the same for all streams that share the same date
    const p = streams[0].prime!.toString(16);
    if (p === "") throw new Error("expected prime field, but no prime exists");

    for (let n = 1, seen = 0; seen < streams.length; n++) {
      process.stdout.write(`\r\x1b[2KWorking ${n}`);
      const seed = calculateNextPrimeSeed(prng).toUpperCase();

      const existing = streams.find((s) => s.published === seed);
      if (existing) {
        seen++;
        console.log(`  found : ${existing.name} | ${seed}`);
      }

      if (await qualifiesSeed(p, seed)) {
        accepted.push({ candidate: n, seed });
      }
    }

    process.stdout.write("\n");
  }

  return accepted;
}

// @ts-ignore
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
