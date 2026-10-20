import * as dates from "./date.ts";
import streams from "./streams.ts";

import type { PublishedSeed, Stream2 } from "./types.ts";

const primes = streams.filter((stream) => stream.kind === "BINARY");

const groupedPrimes = Object.entries(
  Object.groupBy(primes, (p) => String(p.date)),
).map(([_date, grouped]) => grouped);

const newStreams: Stream2[] = [];

for (const group of groupedPrimes) {
  if (!group || !group.length) {
    continue;
  }

  const first = group[0];

  const stream2: Stream2 = {
    date: first.date,
    timestamp: dates.dateToUnixTimestamp(first.date),
    lrand48Iterations: first.prngIterations,
    candidateNumber: 0,
    published: [],
  };

  for (const stream of group) {
    stream2.candidateNumber = stream.overallIterations;
    if (stream.prime) {
      stream2.primeField = stream.prime;
    }
    const pubd: PublishedSeed = {
      name: stream.name,
      seed: stream.published,
    };
    stream2.published.push(pubd);
  }

  newStreams.push(stream2);
}

for (const newStream of newStreams) {
  console.log(newStream);
}
