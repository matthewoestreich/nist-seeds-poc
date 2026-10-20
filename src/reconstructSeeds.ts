import streams from "./streams.ts";
import Rand48 from "./rand48.ts";

import type { Stream, StreamResult } from "./types.ts";
import { dateToUnixTimestamp } from "./date.ts";

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
