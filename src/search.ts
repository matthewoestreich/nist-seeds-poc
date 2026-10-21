#!/usr/bin/env node

import { resolve } from "node:path";
import { formatDate } from "./date.ts";
import streams from "./streams.ts";
import Rand48 from "./Rand48.ts";
import PariGP from "./PariGP.ts";
import PersistentFileRW from "./PersistentFileRW.ts";
import qualifiesSeed from "./qualifies.ts";
import type { OrderCache, Stream } from "./types.ts";
import { SEED_EXTRACTION_PARAMS } from "./constants.ts";

const ACCEPTED_STREAM_DEFAULT_NAME = "-";
const CACHE_FILE_PATH = resolve("./orders_cache.txt");
const CACHER = new PersistentFileRW(CACHE_FILE_PATH);
const PARIGP = new PariGP();
const ORDER_CACHE = await initializeCache(CACHER);

await Main();

async function Main() {
  await searchPrimeStreams(streams);
  PARIGP.close();
}

async function searchPrimeStreams(
  streams: Stream[],
  acceptedStreamDefaultName: string = ACCEPTED_STREAM_DEFAULT_NAME,
  cacher: PersistentFileRW = CACHER,
  parigp: PariGP = PARIGP,
  orderCache: OrderCache = ORDER_CACHE,
): Promise<void> {
  const primeStreams = streams.filter(
    (stream) => stream.primeField !== undefined,
  );

  for (const stream of primeStreams) {
    console.log(`srand48(${stream.timestamp}) [${formatDate(stream.date)}]`);
    // Calls `srand48` under the hood.
    const prng = new Rand48(BigInt(stream.timestamp));

    for (let n = 1, seen = 0; seen < stream.published.length; n++) {
      let name = acceptedStreamDefaultName;
      const seed = calculateNextPrimeSeed(prng);
      const existing = stream.published.find((s) => s.seed === seed);

      if (existing) {
        seen++;
        name = existing.name;
      }

      const isQualified = await qualifiesSeed(
        stream.primeField!,
        seed,
        parigp,
        orderCache,
        cacher,
      );

      if (isQualified) {
        // If we found an existing seed it means it was published by NIST.
        const isPublished = name !== acceptedStreamDefaultName;
        logAcceptedRow(n, seed, name, isPublished);
      }
    }
  }

  await cacher.close();
}

async function initializeCache(cacher: PersistentFileRW): Promise<OrderCache> {
  await cacher.initialize();
  const cache: OrderCache = {};

  for await (const line of cacher.readLines()) {
    const fields = line.split(" ");
    if (fields.length !== 3) {
      return Promise.reject("each cache line must contain 3 columns!");
    }

    const key = `${fields[0]} ${fields[1]}`;
    const value = `${fields[2]}`;
    cache[key] = value;
  }

  return cache;
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

function logAcceptedRow(
  iteration: number,
  seed: bigint,
  name: string,
  isPublished: boolean,
): void {
  const runNum = ordinalSuffixOf(iteration).padStart(6);
  const { label, status } = isPublished
    ? { status: "and published", label: `as '${name}'` }
    : { status: "but skipped", label: "" };
  const row = `  accepted ${status.padEnd(13)} ${runNum} seed ${seed.toString(16).toUpperCase()} ${label}`;
  console.log(row);
}

function calculateNextPrimeSeed(rng: Rand48): bigint {
  let out = "";
  for (let i = 0; i < SEED_EXTRACTION_PARAMS.prime.lrand48Iterations; i++) {
    const byte = rng.lrand48() >>> SEED_EXTRACTION_PARAMS.prime.shiftOutputBy;
    out += byte.toString(16).padStart(SEED_EXTRACTION_PARAMS.prime.width, "0");
  }
  return BigInt(`0x${out}`);
}
