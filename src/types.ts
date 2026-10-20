export type OrderCache = Record<string, string>;

export type PublishedSeed = {
  name: string;
  candidateNumber: number;
  seed: bigint;
};

export type Stream = {
  date: Date;
  timestamp: number;
  primeField?: bigint;
  published: PublishedSeed[];
};

export type StreamResult = {
  name: string;
  date: Date;
  timestamp: number;
  publishedSeed: string;
  calculatedSeed: string;
  isAccurate: boolean;
};

export type SeedExtractionParameters = {
  shiftOutputBy: number;
  width: number;
  lrand48Iterations: number;
};

export interface PendingRequest {
  resolve: (value: bigint) => void;
  reject: (reason: Error) => void;
}
