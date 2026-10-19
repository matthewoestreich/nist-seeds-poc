export type StreamKind = "PRIME" | "BINARY";

export type ReconstructedSeed = {
  value: string;
  bytes: number[];
};

export type StreamResult = {
  name: string;
  kind: StreamKind;
  date: Date;
  unixTimestamp: number;
  published: string;
  value: string;
  isAccurate: boolean;
};

export type Stream = {
  name: string;
  kind: StreamKind;
  date: Date;
  unixTimestamp?: number;
  prngIterations: number;
  overallIterations: number;
  shiftOutputBy: number;
  width: number;
  prime?: bigint;
  published: string;
};
