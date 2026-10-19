import curves from "./curves.ts";
import drand48 from "./drand48.ts";

import { CurveKind, type Curve, type CurveResult } from "./types.ts";

const results: CurveResult[] = curves.map((curve) => {
  curve.unixTimestamp = unixTimestamp(curve.date);
  const value = reconstructSeed(curve);

  return {
    name: curve.name,
    kind: curve.kind,
    date: curve.date,
    unixTimestamp: curve.unixTimestamp,
    expected: curve.expected,
    value,
    isAccurate: value === curve.expected,
  };
});

console.log();
console.table(results);
console.log();

function reconstructSeed(curve: Curve): string {
  const unixTime = curve.unixTimestamp ?? unixTimestamp(curve.date);
  const isPrime = curve.kind === CurveKind.Prime;
  const seed = isPrime ? unixTime : Math.floor(unixTime / 2);
  const prng = new drand48(BigInt(seed));

  const hexs: string[] = [];

  for (let i = 1; i <= curve.overallIterations; i++) {
    for (let j = 0; j < curve.prngIterations; j++) {
      const random = prng.lrand48();

      if (i === curve.overallIterations) {
        const keep = random >>> curve.shiftOutputBy;
        const hex = keep.toString(16).padStart(curve.width, "0").toUpperCase();
        hexs.push(hex);
      }
    }
  }

  return hexs.join("");
}

function unixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
