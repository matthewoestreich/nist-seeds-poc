import streams from "./streams.ts";
import Rand48 from "./rand48.ts";
import { qualifiesSeed } from "./qualifies.ts";
import {
  dateFromUnixTimestamp,
  dateToUnixTimestamp,
  formatDate,
} from "./date.ts";

import type { Stream } from "./types.ts";

const DEFAULT_NAME = "-";

const candidates = await searchPrimeStreams(streams);
console.log({ candidates });

function calculateNextPrimeSeed(rng: Rand48): string {
  let out = "";
  for (let i = 0; i < 20; i++) {
    const byte = rng.lrand48() >>> 23;
    out += byte.toString(16).padStart(2, "0");
  }
  return out;
}

async function searchPrimeStreams(streams: Stream[]): Promise<void> {
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

    // `prime` field will be the same for all streams that share the same date
    const p = streams[0].prime!.toString(16);
    if (p === "") {
      throw new Error(
        `expected prime field, but no prime exists : ${streams[0].name}`,
      );
    }

    for (let n = 1, seen = 0; seen < streams.length; n++) {
      let name = DEFAULT_NAME;
      const seed = calculateNextPrimeSeed(prng).toUpperCase();
      const existing = streams.find((s) => s.published === seed);

      if (existing) {
        seen++;
        name = existing.name;
      }

      if (await qualifiesSeed(p, seed)) {
        logAcceptedRow(n, seed, name);
      }
    }
  }
}

function ordinalSuffixOf(i: number): string {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

function logAcceptedRow(iteration: number, seed: string, name: string): void {
  const runNum = ordinalSuffixOf(iteration).padStart(6);
  const { label, status } =
    name === DEFAULT_NAME
      ? { status: "but skipped", label: "" }
      : { status: "and published", label: `as '${name}'` };
  console.log(
    `  accepted ${status.padEnd(13)} ${runNum} seed ${seed} ${label}`,
  );
}
